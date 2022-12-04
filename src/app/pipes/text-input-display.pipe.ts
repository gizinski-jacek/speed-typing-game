import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textInputDisplay',
})
export class TextInputDisplayPipe implements PipeTransform {
  transform(
    paragraph: string,
    userInput: string
  ): { text: string; input: string }[] | any {
    const splitParagraph: string[] = [];
    const splitUserInput: string[] = [];
    while (paragraph.length > 32) {
      let end: number = 0;
      end = paragraph.substring(0, 32).lastIndexOf(' ');
      splitParagraph.push(paragraph.substring(0, end));
      paragraph = paragraph.substring(end);
      splitUserInput.push(userInput.substring(0, end));
      userInput = userInput.substring(end);
    }
    splitParagraph.push(paragraph);
    splitUserInput.push(userInput);
    const checkedInputs = splitUserInput.map((string, index) =>
      string
        .split('')
        .map((letter, i) => {
          if (letter === splitParagraph[index][i]) {
            return `<span class="correct">${letter}</span>`;
          } else {
            return `<span class="wrong">${letter}</span>`;
          }
        })
        .join('')
    );
    const pairs = splitParagraph.map((string, index) => {
      return { text: string, input: checkedInputs[index] };
    });
    return pairs;
  }
}
