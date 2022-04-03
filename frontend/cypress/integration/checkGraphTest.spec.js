describe('Change the graph time axis', () => {
    it('Visits the dashboard page and checks to see if the graph updates when the time axis is changed from month to year', () => {
      //Visiting the login page
      cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDg5NzYyNzgsImV4cCI6MTY1MTU2ODI3OH0.jr3dlo-sY2bjgYHiDRJ0xD6xImfaxeS9zxvMoUf-1d0')
      cy.visit('/#/dashboard')
      cy.wait(1000)
      cy.contains('Sales Tracker');
      //Change the dealership
      cy.get("[id='dealership-select-cmb']").select('My First Dealership')
      
      //Press the Buttons
      cy.get('button:contains("Year")').click()
      cy.wait(1000)
      cy.get('button:contains("Month")').click()
    })
  })
