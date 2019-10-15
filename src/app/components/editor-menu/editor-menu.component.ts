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
  constructor(private editorService: EditorService) {
    this.createNode = this.createNode.bind(this);
    this.config = this.editorService.config;
  }

  ngOnInit() {
    setTimeout(() => {
      d3.select('svg').on('mousedown', this.createNode);
    }, 1000);
  }

  public toggleNodeAdd(): void {
    this.isAddNode = !this.isAddNode;
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
}
