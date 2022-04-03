describe('Add a vehicle zone to a dealership', () => {
    it('Add a vehicle zone to a dealership', () => {
      //Visiting the login page
      cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDg5NzYyNzgsImV4cCI6MTY1MTU2ODI3OH0.jr3dlo-sY2bjgYHiDRJ0xD6xImfaxeS9zxvMoUf-1d0')
      cy.visit('/#/dealerships/61a7f8561f1880abfb2f4330')
      cy.wait(1000)

      //Press the Buttons
      cy.contains("Add a location zone").click()
      
      cy.get("[placeholder='Unique name for the zone']")
      .type('Zone 1')
      .should('have.value', 'Zone 1')
      
      cy.get("[class='vue-map']").click(150,150)
      cy.get("[class='vue-map']").click(100,100)
      cy.get("[class='vue-map']").click(100,150)
      cy.get("[class='vue-map']").click(150,100)
      cy.get("[class='vue-map']").click(10,100)

      cy.contains("Add Zone").click()

    })
  })
