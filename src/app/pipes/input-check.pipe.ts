import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inputCheck',
})
export class InputCheckPipe implements PipeTransform {
  transform(
    quote: string,
    userInput: string
  ): { quote: string; input: string }[] | any {
    const splitQuote: string[] = [];
    const splitUserInput: string[] = [];
    while (quote.length > 32) {
      let end: number = 0;
      end = quote.substring(0, 32).lastIndexOf(' ');
      splitQuote.push(quote.substring(0, end));
      quote = quote.substring(end);
      splitUserInput.push(userInput.substring(0, end));
      userInput = userInput.substring(end);
    }
    splitQuote.push(quote);
    splitUserInput.push(userInput);
    let checkedInputs = splitUserInput.map((string, index) =>
      string
        .split('')
        .map((letter, i, array) => {
          let html: string = '';
          if (letter === splitQuote[index][i]) {
            html = `<span class="correct">${letter}</span>`;
          } else {
            html = `<span class="wrong">${letter}</span>`;
          }
          if (!array.length) {
            return '<span class="custom-cursor"></span>';
          }
          if (
            i === array.length - 1 &&
            array.length !== splitQuote[index].length
          ) {
            html = html + '<span class="custom-cursor"></span>';
          }
          return html;
        })
        .join('')
    );
    const pairs = splitQuote.map((string, index) => {
      return { quote: string, input: checkedInputs[index] };
    });
    return pairs;
  }
}
