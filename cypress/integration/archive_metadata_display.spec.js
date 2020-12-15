describe('A single Archive Show page metadata section', () => {
  beforeEach(() => {
    cy.visit('/archive/hs59hv2z');
    cy.get('#content-wrapper > div.item-page-wrapper > div.item-details-section > div.details-section-metadata > table')
      .as('metadataSection');
  })

  it('displays the identifier field and its corresponding value', () => {
    cy.get('@metadataSection')
      .find(':nth-child(1) > th.collection-detail-key')
      .invoke('text')
      .should('equal', 'Identifier');
    cy.get('@metadataSection')
      .find(':nth-child(1) > td.collection-detail-value').click();
    cy.url({ timeout: 2000 }).should('include', '/archive/hs59hv2z');
  })

  it('displays the custom key field and its corresponding value', () => {
    cy.get('@metadataSection')
      .find(':nth-child(5) > th.collection-detail-key')
      .invoke('text')
      .should('equal', 'Permanent Link');
    cy.get('@metadataSection')
      .find(':nth-child(5) > td.collection-detail-value')
      .contains('idn.lib.vt.edu/ark:/53696/hs59hv2z');
  })
})