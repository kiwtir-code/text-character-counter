import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnInit, Optional, Renderer2, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[ktrTextCharacterCounter]'
})
export class TextCharacterCounterDirective implements OnInit, AfterViewInit {

  @Input({required: true, alias: 'ktrTextCharacterCounter'}) characterCountLimit!: number;
  @Input() msgDisplayType: 'none' | 'inline' | 'inline-block' | 'block' = 'block';
  @Input() msgTextAlign: 'left' | 'center' | 'right' = 'right';
  @Input() showMsgText = true;
  @Input() showMsgOnDirty = true;
  @Input() msgMarginTop = '5px';
  @Input() showMsgWarningColor = true;
  @Input() warningColor = '#fd3995';
  @Input() charLimitWarningThreshold = 5;
  textDivElement!: HTMLDivElement;

  constructor(private el: ElementRef, private renderer: Renderer2, @Self() @Optional() private ngControl: NgControl) { }

  ngOnInit() {
    this.textDivElement = this.renderer.createElement('div');
    this.renderer.setStyle(this.textDivElement, 'margin-top', this.msgMarginTop);
    this.renderer.setStyle(this.textDivElement, 'text-align', this.msgTextAlign);
    const parentElement = this.renderer.parentNode(this.el);
    const nextSibling = this.renderer.nextSibling(this.el);
    if(parent)
      this.renderer.insertBefore(parentElement, this.textDivElement, nextSibling);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateCounter(this.ngControl.control?.value);
    })
  }

  @HostListener('input', ['$event']) onInput(event: any) {
    this.updateCounter(event.target.value);
  }

  updateCounter(value: string) {
    const isControlDirty =  this.ngControl.control?.dirty;
    if(this.showMsgOnDirty && !isControlDirty) {
      this.renderer.setStyle(this.textDivElement, 'display', 'none');
    } else {
      const remainingCharacters = this.characterCountLimit - value.length;
      if(remainingCharacters <= this.charLimitWarningThreshold && this.showMsgWarningColor) {
        this.renderer.setStyle(this.textDivElement, 'color', this.warningColor);
      } else {
        this.renderer.setStyle(this.textDivElement, 'color', 'inherit');
      }
      const msg = `${remainingCharacters} ${this.showMsgText? 'Characters Left' : ''} /${this.characterCountLimit}`;
      this.renderer.setStyle(this.textDivElement, 'display', this.msgDisplayType);
      this.renderer.setProperty(this.textDivElement, 'textContent', msg);
    }
  }

}
