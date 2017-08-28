import { Element } from '/node_modules/@polymer/polymer/polymer-element.js';
import '/node_modules/@polymer/paper-button/paper-button.js';
// import '/node_modules/@polymer/app-layout/app-layout.js';
import '/node_modules/@polymer/iron-image/iron-image.js';
import '/node_modules/@polymer/iron-ajax/iron-ajax.js';
// import '/node_modules/@polymer/paper-styles/paper-syles.js';
import '/node_modules/@polymer/paper-styles/color.js';

export class WhoseFlagApp extends Element {
    static get is() { return 'whose-flag-app'; }
    static get properties() {
        return {
          countryA: {
            type: Object
          },
          countryB: {
            type: Object
          }, 
          outputMessage: {
            type: String, 
            value: ""
          },
          correctAnswer: {
            type: Object
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
    }

      __getRandomCountry() {
        return Math.floor(Math.random() * (this.countryList.length));
      }

      _restart() {
        window.location.reload();
      }

    static get template(){
        return `
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

        <app-header>
            <app-toolbar>
            <div main-title>Whose flag is this?</div>
            </app-toolbar>
        </app-header>
        <iron-ajax
            auto
            id="ironAjax"
            url="/data/countrycodes.json"
            handle-as="json"
            on-response="_handleResponse">
        </iron-ajax>
        <div id="flag-image-container">
            <iron-image 
            id="flag-image"
            preload fade src="data/svg/[[correctAnswer.code]].svg">
            </iron-image>
            <div id="answer-button-container">
            <paper-button on-click="_selectAnswer" id="optionA" class="answer">[[countryA.name]]</paper-button>
            <paper-button on-click="_selectAnswer" id="optionB" class="answer">[[countryB.name]]</paper-button>
            </div>
            <p>[[outputMessage]]</p>
            <paper-button on-click="_restart" class="another" id="another">Another!</paper-button> 
        </div>
        `;
    }
}

customElements.define('whose-flag-app', WhoseFlagApp);