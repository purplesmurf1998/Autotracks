describe('Change the location of a vehicle', () => {
    it('Sets a new zone for the vehicle', () => {
      //Visiting the login page
      cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDg5NzYyNzgsImV4cCI6MTY1MTU2ODI3OH0.jr3dlo-sY2bjgYHiDRJ0xD6xImfaxeS9zxvMoUf-1d0')
      cy.visit('/#/inventory')
      cy.wait(1000)

      //Change the dealership
      cy.get("[id='dealership-select-cmb']").select('My First Dealership')
      cy.wait(2000)

      cy.get("tr").eq(3).click()
      
      //Press the Buttons
      cy.contains("Select an action").click()
      cy.contains("Add to zone").click()
      cy.get('[id="zoneSelectDropdown"]').select(4)

      cy.get('[class="btn mr-2 btn-primary"]').click()
    })
  })
