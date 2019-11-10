import { Component, OnInit } from '@angular/core';
import { EditorService } from '../../services/editor/editor.service';
import { EditorModel } from '../editor/editor.model';
import { UUID } from 'angular2-uuid';
import * as d3 from 'd3';

@Component({
  selector: 'app-editor-menu',
  templateUrl: './editor-menu.component.html',
  styleUrls: ['./editor-menu.component.scss']
})

export class EditorMenuComponent implements OnInit {
  public config: EditorModel;
  public isAddNode: boolean = false;
  public isAddLink: boolean = false;

  public activeNode = null;
  public activeCircle = null;
  constructor(private editorService: EditorService) {
    this.createNode = this.createNode.bind(this);
    this.selectLinkNode = this.selectLinkNode.bind(this);
    this.selectLinkCircle = this.selectLinkCircle.bind(this);
    this.config = this.editorService.config;
  }

  ngOnInit() {
    setTimeout(() => {
      d3.select('svg').on('mousedown', this.createNode);
    }, 1000);
  }

  public toggleNodeAdd(): void {
    this.isAddNode = !this.isAddNode;
    this.isAddLink = false;
  }

  public toggleLinkAdd(): void {
    this.isAddLink = !this.isAddLink;
    this.isAddNode = false;
    if (this.isAddLink) {
      d3.select('svg').selectAll('rect.node').on('mouseup', this.selectLinkNode);
    } else {
      d3.select('svg').selectAll('rect.node').on('mouseup', null);
    }
  }

  public createNode(): void {
    if (this.isAddNode) {
      this.config.nodes.push({
        id: this.editorService.getMaxId(this.config) + 1,
        name: 'w',
        group: 1,
        count: 0,
        x: d3.event.x,
        y: d3.event.y
      });
      this.editorService.simulation.nodes(this.config.nodes);
      this.editorService.simulation.alpha(1);
      this.editorService.simulation.restart();
    }
  }

  public selectLinkCircle(): void {
    if (this.isAddLink) {
      this.activeCircle = d3.event.target.__data__;
      d3.select('svg').selectAll('circle.node').on('mouseup', null);
      d3.select('svg').selectAll('rect.node').on('mouseup', this.selectLinkNode);
      this.config.edges.push({source: this.activeNode.id, target: this.activeCircle.id});
      this.editorService.simulation.force('link').links(this.config.edges);
      this.editorService.simulation.alpha(1);
      this.editorService.simulation.restart();
      this.isAddLink = null;
      this.activeNode = null;
    }
  }

  public selectLinkNode(): void {
    if (this.isAddLink) {
      this.activeNode = d3.event.target.__data__;
      console.dir(d3.event.target.__data__.id);
      d3.select('svg').selectAll('rect.node').on('mouseup', null);
      d3.select('svg').selectAll('circle.node').on('mouseup', this.selectLinkCircle);
    }
  }
}
