var Pending = require('../../lib/exec/pending');

describe('pending exec', function() {
  var pending,
      popSpy;
  beforeEach(function() {
    popSpy = this.spy();
    pending = Pending.create();
    pending.on('pop', popSpy);
  });

  it('should init clean', function() {
    pending.pending().should.equal(0);
  });

  it('should push events', function() {
    pending.push('test', 123, function() {});
    pending.pending().should.equal(1);
  });
  describe('#pop', function() {
    it('should pop events', function() {
      pending.push('test', 123, function() {});
      pending.pop('test', 123);
      pending.pending().should.equal(0);
      popSpy.should.have.been.calledOnce;
    });
    it('should throw on mismatch', function() {
      pending.push('test', 123, function() {});

      should.throw(function() {
        pending.pop('test', 413);
      }, Error, 'Pending event test:413 not found.');
      popSpy.should.not.have.been.called;
    });
  });

  describe('#cancel', function() {
    it('should cancel events', function() {
      var spy = this.spy();
      pending.push('test', 123, spy);

      pending.cancel('test', 123);
      spy.callCount.should.equal(1);
      popSpy.should.have.been.calledOnce;
    });
    it('should throw on not found', function() {
      pending.push('test', 123, function() {});

      should.throw(function() {
        pending.cancel('test', 413);
      }, Error, 'Pending event test:413 not found.');
      popSpy.should.not.have.been.called;
    });
    it('should not throw on not found', function() {
      pending.push('test', 123, function() {});

      pending.cancel('test', 413, true);
      popSpy.should.not.have.been.called;
    });
  });

  it('should reset pending events', function() {
    var spy = this.spy(),
        spy2 = this.spy();
    pending.push('test', 123, spy);
    pending.push('bar', 'baz', spy2);

    pending.reset();
    spy.callCount.should.equal(1);
    spy2.callCount.should.equal(1);
    popSpy.should.not.have.been.called;
  });
});