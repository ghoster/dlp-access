describe('Archive static img view', () => {
  it('shows correct img tag', () => {
    cy.visit('/archive/m58xyh90');
    cy.get('#content-wrapper > div > div.item-image-section > div.row > div > img')
      .eq(0)
      .should('have.class', 'item-img')
      .should('be.visible');
  });
});

describe('Archive audio player', () => {
  it('renders html5 audio player', () => {
    cy.visit('/archive/m69xyh01');
    cy.get('audio')
      .eq(0)
      .should('have.id', 'player1_html5');
  });
});

describe('Archive video player', () => {
  it('renders html5 video player', () => {
    cy.visit('/archive/m70xyh12');
    cy.get('video')
      .eq(0)
      .should('have.id', 'player1_html5')
      .should('be.visible');
  });
});

describe('Archive kaltura embed', () => {
  it('renders kaltura video player inside iframe', () => {
    cy.visit('http://localhost:3000/archive/m81xyh23');
    cy.get('iframe')
      .eq(0)
      .should('have.class', 'kaltura-player')
      .should('be.visible');
  });
});

describe('Archive pdf embed', () => {
  it('renders pdf file inside iframe', () => {
    cy.visit('http://localhost:3000/archive/m92xyh34');
    cy.get('iframe')
      .eq(0)
      .should('have.class', 'pdf-viewer')
      .should('be.visible');
  });
});

describe('Archive Mirador viewer', () => {
  it('renders viewer if manifest.json', () => {
    cy.visit('/archive/5v709r98');
    cy.get('div#mirador_viewer')
      .eq(0)
      .should('have.class', 'mirador-container')
      .should('be.visible');
    cy.get('div.workspace-container > div > div > div.window > div.content-container > div.view-container > div.image-view')
      .eq(0)
      .should('be.visible');
  });
});