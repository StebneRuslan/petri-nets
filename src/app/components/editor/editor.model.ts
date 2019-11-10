export class EditorModel {
  public nodes: any = [
    { id: 0, name: '>', group: 0, count: 4 },
    { id: 1, name: 'b', group: 0, count: 0 },
    { id: 2, name: 'c', group: 0, count: 0 },
    { id: 3, name: 'i', group: 0, count: 0 },
    { id: 4, name: 'j', group: 0, count: 0 },
    { id: 5, name: '^', group: 0, count: 0 },
    { id: 6, name: 'x', group: 1 },
    { id: 7, name: 'y', group: 1 },
    { id: 8, name: 'z', group: 1 },
    { id: 9, name: '!', group: 1 },
    // { id: 10, name: 'w', group: 0, count: 0 }
    // 4
  ];
  public edges: any =  [
    { source: 0, target: 9 },
    { source: 9, target: 1 },
    { source: 1, target: 6 },
    { source: 6, target: 2 },
    { source: 6, target: 3 },
    { source: 2, target: 8 },
    { source: 3, target: 7 },
    { source: 7, target: 4 },
    { source: 4, target: 8 },
    { source: 8, target: 5 },
    // { source: 9, target: 10 },
    // { source: 10, target: 7 }
  ];
}
