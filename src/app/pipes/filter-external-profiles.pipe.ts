import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterExternalProfiles'
})
export class FilterExternalProfilesPipe implements PipeTransform {

  transform(value: any, args: any): any {
    if (args === '') {
      return value;
    }
    const resultSearchBox = [];
    for (const post of value) {
      if (post.name.toLowerCase().indexOf(args.toLowerCase()) > -1){
        resultSearchBox.push(post);
      }      
    }
    return resultSearchBox;
  }

}
