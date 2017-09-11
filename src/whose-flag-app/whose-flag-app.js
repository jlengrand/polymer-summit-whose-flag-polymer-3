import { Element } from '/node_modules/@polymer/polymer/polymer-element.js';
import '/node_modules/@polymer/paper-button/paper-button.js';
import '/node_modules/@polymer/iron-image/iron-image.js';
import '/node_modules/@polymer/iron-ajax/iron-ajax.js';
import '/node_modules/@polymer/paper-styles/paper-styles.js';

import {html} from '/node_modules/lit-html/lit-html.js';
import {render} from '/node_modules/lit-html/lib/lit-extended.js';

export class WhoseFlagApp extends Element {
    static get is() { return 'whose-flag-app'; }
    static get properties() {
        return {
          countryA: {
            type: Object,
            value:{ 
              code: "",
              name: ""
            }
          },
          countryB: {
            type: Object,
            value:{ 
              code: "",
              name: ""
            }
          }, 
          outputMessage: {
            type: String, 
            value: ""
          },
          correctAnswer: {
            type: Object, 
            value:{ 
              code: "",
              name: ""
            }
          }, 
          userAnswer: {
            type: String, 
          },
          countryList: {
            type: Object
          }
        };
    }

    _selectAnswer(event) {
        let clickedButton = event.target;
        this.userAnswer = clickedButton.textContent;
        if (this.userAnswer == this.correctAnswer.name) {
          this.outputMessage = `${this.userAnswer} is correct!`;
        }
        else {
          this.outputMessage = `Nope! The correct answer is ${this.correctAnswer.name} !`;
        }
        render(this.draw(), this.shadowRoot);      
      }

      _handleResponse(event) {
        this.countryList = event.detail.response.countrycodes;
        while (!this.countryA || !this.countryB || (this.countryA.code == this.countryB.code)){
          this.countryA = this.countryList[this.__getRandomCountry()];
          this.countryB = this.countryList[this.__getRandomCountry()];
        }
        this.correctAnswer = this.countryA;

        let coin = (Math.floor(Math.random() * 2));
        this.correctAnswer = coin == 1 ? this.countryA : this.countryB;       
        render(this.draw(), this.shadowRoot);      
      }

      __getRandomCountry() {
        return Math.floor(Math.random() * (this.countryList.length));
      }

      _restart() {
        window.location.reload();
      }

    draw(){
      return html`
      <style>
        :host {
          display: block;
          font-family: Roboto, Noto, sans-serif;
        }
        paper-button {
          color: white;
        }
        paper-button.another {
          background: var(--paper-blue-500);
          width: 100%;
        }
        paper-button.another:hover {
          background: var(--paper-light-blue-500);
        }
        paper-button.answer {
          background: var(--paper-purple-500);
          flex-grow: 1;
        }
        paper-button.answer:hover {
          background: var(--paper-pink-500);
        }
        app-toolbar {
          background-color: var(--paper-blue-500);
          color: white;
          margin: 20px 0;
        }          
        
        .main-title {
          background-color: var(--paper-blue-500);
          color: white;
          margin: 20px 0;
          height: 66px;
          font-size: 20px;
          padding: 0 16px;
          line-height: 64px;
        }
        iron-image {
          border: solid;
          width: 100%;
          --iron-image-width: 100%;
           background-color: white;
        }
        #flag-image-container {
          max-width: 600px;
          width: 100%;
          margin: 0 auto;
        }
        #answer-button-container {
          display: flex; /* or inline-flex */
          flex-flow: row wrap;
          justify-content:space-around;
        }
      </style>

      <div class="main-title" main-title>Whose flag is this?</div>
      <app-header>
          <app-toolbar>
          </app-toolbar>
      </app-header>
      <iron-ajax
          auto
          id="ironAjax"
          url="/data/countrycodes.json"
          handle-as="json"
          on-response=${ e => this._handleResponse(e)}>
      </iron-ajax>
      <div id="flag-image-container">
          <iron-image 
          id="flag-image"
          preload fade src="data/svg/${this.correctAnswer.code}.svg">
          </iron-image>
          <div id="answer-button-container">
          <paper-button on-click=${ e => this._selectAnswer(e)} id="optionA" class="answer">${this.countryA.name}</paper-button>
          <paper-button on-click=${ e => this._selectAnswer(e)} id="optionB" class="answer">${this.countryB.name}</paper-button>
          </div>
          <p>${this.outputMessage}</p>
          <paper-button on-click=${ e => this._restart(e)} class="another" id="another">Another!</paper-button> 
      </div>
      `;
    }

    ready(){
      super.ready();
    }

    constructor() {
      super();
      this.attachShadow({mode: 'open'});
      render(this.draw(), this.shadowRoot);      
    }
}

customElements.define('whose-flag-app', WhoseFlagApp);