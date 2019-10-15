import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { EditorModel } from './editor.model';
import { EditorService } from '../../services/editor/editor.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})

export class EditorComponent implements OnInit {
  public json: EditorModel;
  private deadColor = '#333';
  private liveColor = '#666';

  public rects = null;
  public links = null;
  public circles = null;
  public texts = null;
  constructor(private editorService: EditorService) {
    this.json = this.editorService.config;
  }

  ngOnInit() {
    this.ticked = this.ticked.bind(this);
    this.getColor = this.getColor.bind(this);
    this.editorService.simulation = d3.forceSimulation(this.json.nodes)
      .force('charge', d3.forceManyBody().strength(-20))
      .force('center', d3.forceCenter(300, 300))
      .on('tick', this.ticked);
    this.editorService.simulation.force('link', d3.forceLink().links(this.json.edges));
  }

  private ticked(): void {
    this.links = this.createLink(this.json);
    this.rects = this.createSquares(this.json);
    this.circles = this.createCircles(this.json);
    this.texts = this.createTitle();
    this.createText();

    this.texts
      .attr('x', (d) => d.x - 5 )
      .attr('y', (d) => d.y + 5 );
    this.circles
      .attr('cx', (d) => d.x )
      .attr('cy', (d) => d.y );
    this.rects
      .attr('x', (d) => d.x - 15 )
      .attr('y', (d) => d.y - 15 );
    this.links
      .attr('x1', (d) => d.source.x )
      .attr('y1', (d) => d.source.y )
      .attr('x2', (d) => d.target.x )
      .attr('y2', (d) => d.target.y );
  }

  public createSquares(config: EditorModel) {
    const square = d3.select('svg')
      .selectAll('rect.node')
      .data(this.editorService.getNodes(config));

    square.enter().append( 'rect' )
      .attr('cx', (d) => {
        return d.x;
      })
      .attr('cy', (d) => {
        return d.y;
      })
      .attr( 'class', 'node' )
      .attr( 'width', 10 * 2 )
      .attr( 'height', 10 * 2 )
      .merge(square)
      .style( 'stroke', '#000' )
      .style( 'stroke-width', '2' )
      .on('click', (g, j) => {
        if (this.active(g)) {
          var e, k, l, len, len1, ref, ref1;
          ref = this.incoming(g);
          for (k = 0, len = ref.length; k < len; k++) {
            e = ref[k];
            e.source.count -= 1;
          }
          ref1 = this.outgoing(g);
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            e = ref1[l];
            e.target.count += 1;
          }
          this.rects.transition().style('fill', this.getColor);
          return this.texts.transition().text((d) => {
            if (d.count === 0) {
              return '';
            } else {
              return d.count;
            }
          })(this)();
        }
      })
      .style( 'fill', this.getColor );
    square.exit().remove();
    return square;
  }

  public createCircles(config: EditorModel) {
    const circle = d3.select('svg')
      .selectAll('circle.node')
      .data(this.editorService.getHolds(config));
    circle.enter().append('circle')
      .attr('class', 'node')
      .attr('r', 10)
      .merge(circle)
      .style('fill', (d) => {
        if (d.name === '>') {
          return 'lime';
        } else if (d.name === '^') {
          return 'red';
        } else {
          return 'white';
        }
      })
      .style('stroke', '#000')
      .style('stroke-width', '2');
    circle.exit().remove();
    return circle;
  }
  public createTitle() {
    const texts = d3.select('svg').selectAll('text')
      .data(this.editorService.getHolds(this.json));

    texts.enter().append( 'text' )
      .text( (d) => {
        if (d.count === 0) {
          return '';
        } else {
          return d.count;
        }
      });
    texts.exit().remove();
    return texts;
  }
  public createLink(config: EditorModel) {
    const links = d3.select('svg')
      .selectAll('line.link')
      .data(config.edges);
    links.enter().append('line')
      .attr('class', 'link')
      .merge(links)
      .style('stroke', '#000')
      .style('stroke-width', 1);
    links.exit().remove();
    return links;
  }
  public createText() {
    const node = d3.select('svg').selectAll('.node');
    node.append('title')
      .text( (d) => d.name );
    return node;
  }
  public incoming(n) {
    const results = [];
    for (let i = 0; i < this.json.edges.length; i++) {
      if (this.json.edges[i].target === n) {
        results.push(this.json.edges[i]);
      }
    }
    return results;
  }

  public outgoing(n) {
    const results = [];
    for (let i = 0; i < this.json.edges.length; i++) {
      if (this.json.edges[i].source === n) {
        results.push(this.json.edges[i]);
      }
    }
    return results;
  }

  public active(n) {
    return this.editorService.all((() => {
      const results = [];
      for (let i = 0; i < this.incoming(n).length; i++) {
        results.push(this.incoming(n)[i].source.count > 0);
      }
      return results;
    })());
  }

  public getColor(d, i) {
    if (this.active(d)) {
      return this.liveColor;
    } else {
      return this.deadColor;
    }
  }
}
