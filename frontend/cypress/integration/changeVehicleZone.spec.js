describe('Change a vehicle zone for a dealership', () => {
    it('Change a vehicle zone for a dealership', () => {
      //Visiting the login page
      cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDg5NzYyNzgsImV4cCI6MTY1MTU2ODI3OH0.jr3dlo-sY2bjgYHiDRJ0xD6xImfaxeS9zxvMoUf-1d0')
      cy.visit('/#/dealerships/61a7f8561f1880abfb2f4330')
      cy.wait(1000)

      //Press the Buttons
      cy.contains("Testing zone").click()
      
      cy.get("[type='text']").first()
      .type(' Changed')
      .should('have.value', 'Testing zones Changed')


      cy.contains("Save and Close").click()

      cy.contains("Testing zones Changed")
    })
  })
