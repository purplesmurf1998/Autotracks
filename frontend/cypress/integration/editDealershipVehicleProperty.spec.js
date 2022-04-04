describe('Change a vehicle property for a dealership', () => {
    it('Change a vehicle property for a dealership and add a new one', () => {
      //Visiting the login page
      cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDg5NzYyNzgsImV4cCI6MTY1MTU2ODI3OH0.jr3dlo-sY2bjgYHiDRJ0xD6xImfaxeS9zxvMoUf-1d0')
      cy.visit('http://localhost:8080/#/dealerships/61a7f8561f1880abfb2f4330')
      cy.wait(1000)

      //Press the Buttons
      cy.contains("Model Number").click()
      cy.contains("Edit custom vehicle property").click()
      
      cy.get("[id='header-name']")
      .type(' changed')
      .should('have.value', 'Model Number changed')
      cy.contains("Save").click()

      cy.contains("Create a custom vehicle property").click()

      cy.get("[id='header-name-txt']")
      .type('New Property')
      .should('have.value', 'New Property')

      cy.get("[id='input-type-cmb']").select('Text')
      
      cy.get("[id='create-staff']").click()
      
      cy.visit('http://localhost:8080/#/dealerships/61a7f8561f1880abfb2f4330')
      cy.wait(1000)
      
      cy.contains("Model Number changed")
      cy.contains("New Property")


    })
  })
