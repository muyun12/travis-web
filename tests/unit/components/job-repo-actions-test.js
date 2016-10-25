import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

// stub auth service
const authStub = Ember.Service.extend({
  currentUser: Ember.Object.create()
});

moduleForComponent('job-repo-actions', 'JobRepoActionsComponent', {
  unit: true,
  needs: ['helper:perform'],
  beforeEach() {
    this.register('service:auth', authStub);
  }
});

test('it shows cancel button if canCancel is true', function (assert) {
  var component;
  component = this.subject({
    canCancel: true
  });
  this.render();
  assert.ok(component.$('a[title="Cancel job"]').length, 'cancel link should be visible');
});

test('it shows restart button if canRestart is true', function (assert) {
  var component;
  component = this.subject({
    canRestart: true
  });
  this.render();
  assert.ok(component.$('a[title="Restart job"]').length, 'restart link should be visible');
});

test('user can cancel if she has pull permissions to a repo and job is cancelable', function (assert) {
  var component, job;
  job = Ember.Object.create({
    canCancel: false,
    userHasPullPermissionForRepo: true
  });
  component = this.subject({
    job: job,
    userHasPullPermissionForRepo: false
  });
  assert.ok(!component.get('canCancel'));
  component.set('userHasPullPermissionForRepo', true);
  assert.ok(!component.get('canCancel'));
  job.set('canCancel', true);
  assert.ok(component.get('canCancel'));
});

test('user can restart if she has pull permissions to a repo and job is restartable', function (assert) {
  var component, job;
  job = Ember.Object.create({
    canRestart: false,
    userHasPullPermissionForRepo: true
  });
  component = this.subject({
    job: job,
    userHasPullPermissionForRepo: false
  });
  assert.ok(!component.get('canRestart'));
  component.set('userHasPullPermissionForRepo', true);
  assert.ok(!component.get('canRestart'));
  job.set('canRestart', true);
  assert.ok(component.get('canRestart'));
});

test('it properly checks for user permissions for a repo', function (assert) {
  this.assert = assert;
  assert.expect(3);

  const repo = Ember.Object.create({
    id: 44
  });

  const component = this.subject({
    repo: repo
  });

  component.set('auth.currentUser.hasAccessToRepo', (repo) => {
    this.assert.ok(repo.get('id', 44));
    this.assert.ok(true, 'hasAccessToRepo was called');
    return false;
  });

  assert.notOk(component.get('userHasPermissionForRepo'), 'user should not have access to a repo');
});
