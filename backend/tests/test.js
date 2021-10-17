describe('a suite of tests', function() {
  this.timeout(500);

  it('should take less than 500ms', function(done) {
    setTimeout(done, 300);
  });

  it('should take less than 500ms as well', function(done) {
    setTimeout(done, 250);
  });
});

describe('User', function() {
    describe('#save()', function() {
      it('should save without error', function(done) {
        var user = new User('Luna');
        user.save(done);
      });
    });
  });
  