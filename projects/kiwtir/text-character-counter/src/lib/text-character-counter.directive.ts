import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnInit, Optional, Renderer2, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[ktrTextCharacterCounter]'
})
export class TextCharacterCounterDirective implements OnInit, AfterViewInit {

  @Input({required: true, alias: 'ktrTextCharacterCounter'}) characterCountLimit!: number;
  @Input() msgHiddenType: 'display' | 'visibility' = 'display';
  @Input() msgDisplayType: 'none' | 'inline' | 'inline-block' | 'block' = 'block';
  @Input() msgFontSize!: string;
  @Input() msgTextAlign: 'left' | 'center' | 'right' = 'right';
  @Input() msgMarginTop = '5px';
  @Input() msgWarningColor = '#fd3995';
  @Input() msgCharLimitWarningThreshold = 5;
  @Input() showMsgText = true;
  @Input() showMsgOnDirty = true;
  @Input() showMsgWarningColor = true;
  textDivElement!: HTMLDivElement;

  constructor(private el: ElementRef, private renderer: Renderer2, @Self() @Optional() private ngControl: NgControl) { }

  ngOnInit() {
    this.textDivElement = this.renderer.createElement('div');
    this.renderer.setStyle(this.textDivElement, 'margin-top', this.msgMarginTop);
    this.renderer.setStyle(this.textDivElement, 'text-align', this.msgTextAlign);
    const parentElement = this.renderer.parentNode(this.el.nativeElement);
    const nextSibling = this.renderer.nextSibling(this.el.nativeElement);
    if(parent)
      this.renderer.insertBefore(parentElement, this.textDivElement, nextSibling);

    if(!this.msgFontSize)
      this.msgFontSize = window.getComputedStyle(this.textDivElement).fontSize;

    this.renderer.setStyle(this.textDivElement, 'font-size', this.msgFontSize);
    this.renderer.setStyle(this.textDivElement, 'min-height', window.getComputedStyle(this.textDivElement).lineHeight);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateCounter(this.ngControl?.control?.value);
    })
  }

  @HostListener('input', ['$event']) onInput(event: any) {
    this.updateCounter(event.target.value);
  }

  updateCounter(value: string) {
    if(this.ngControl) {
    const isControlDirty =  this.ngControl.control?.dirty;
    if(this.showMsgOnDirty && !isControlDirty) {
      if(this.msgHiddenType == 'display')
        this.renderer.setStyle(this.textDivElement, 'display', 'none');
      else
        this.renderer.setStyle(this.textDivElement, 'visibility', 'hidden');
    } else {
      const remainingCharacters = this.characterCountLimit - value.length;
      if(remainingCharacters <= this.msgCharLimitWarningThreshold && this.showMsgWarningColor) {
        this.renderer.setStyle(this.textDivElement, 'color', this.msgWarningColor);
      } else {
        this.renderer.setStyle(this.textDivElement, 'color', 'inherit');
      }
      const msg = `${remainingCharacters} ${this.showMsgText? 'Characters Left' : ''} /${this.characterCountLimit}`;
      if(this.msgHiddenType == 'display')
        this.renderer.setStyle(this.textDivElement, 'display', this.msgDisplayType);
      else
        this.renderer.setStyle(this.textDivElement, 'visibility', 'visible');
      this.renderer.setProperty(this.textDivElement, 'textContent', msg);
    }
    }
  }

}
