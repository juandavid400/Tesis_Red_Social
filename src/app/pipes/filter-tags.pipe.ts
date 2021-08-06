import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTags'
})
export class FilterTagsPipe implements PipeTransform {

  transform(value: any, args: any): any {
    if (args === '') {
      return value;
    }
    const resultSearchBox = [];
    for (const post of value) {
      if (post.Categoria.toLowerCase().indexOf(args.toLowerCase()) > -1 ){
        resultSearchBox.push(post);
      }      
    }
    return resultSearchBox;
  }

}
