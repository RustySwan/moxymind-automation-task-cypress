declare global {
    namespace Cypress {
      interface Chainable {
        /**
         * Custom command to select DOM element by data-cy attribute.
         */
        getDataTest(value: string): Chainable<JQuery<HTMLElement>>
      }
    }
  }