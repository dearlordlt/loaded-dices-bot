/* eslint-disable operator-linebreak */
/* eslint-disable no-undef */
/* eslint-disable no-console */
const { CharacterModel } = require('../models/player');
const { playerManager } = require('../commands/player');

const msg = {
  reply() {

  },
};
describe('player', () => {
  beforeEach(() => {
    spyOn(CharacterModel, 'findOneAndDelete').and.returnValue(null);
    spyOn(CharacterModel, 'create').and.returnValue(null);
    spyOn(msg, 'reply').and.returnValue(null);
  });


  it('handleCreateChar should try to delete', () => {
    const player = playerManager.getPlayer(0, 'test');
    player.handleCreateChar(msg, 'test char');
    expect(player.model.attr.str).toBe(10);
    expect(player.model.attr.sta).toBe(10);
    expect(player.model.attr.dex).toBe(10);
    expect(player.model.attr.ref).toBe(10);
    expect(player.model.attr.per).toBe(10);
    expect(player.model.attr.will).toBe(10);
  });
});
