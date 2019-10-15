import { Injectable } from '@angular/core';
import { EditorModel } from '../../components/editor/editor.model';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  public svg = d3.select('svg');
  public config = new EditorModel();
  public simulation = null;
  constructor() { }

  public getNodes(config: EditorModel): any {
    return config.nodes.filter(node => node.group === 1);
  }

  public getHolds(config: EditorModel): any {
    return config.nodes.filter(node => node.group === 0);
  }

  public all(xs) {
    return xs.length && xs.reduce((a, b) => a && b, true);
  }

  public getMaxId(config: EditorModel): number {
    let max = 0;
    Object.values(config.nodes).map((node: any) => {
      if (node.id > 0) {
        max = node.id;
      }
    });
    return max;
  }
}
