import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, args: any): any {
    if (args === '') {
      return value;
    }
    const resultSearchBox = [];
    for (const post of value) {
      if (post.Title.toLowerCase().indexOf(args.toLowerCase()) > -1 || post.Autor.toLowerCase().indexOf(args.toLowerCase()) > -1){
        resultSearchBox.push(post);
      }      
    }
    return resultSearchBox;
  }

}
