Hooks.on("init", function () {

  game.settings.register('13th-age-combat-loops', 'elPrevious', {
    name: 'The Escalation level the last time combat was updated.',
    scope: 'world',
    config: false,
    default: -1,
    type: Number
  });
});

Hooks.on('updateCombat', (combat, update) => {
  //  If user is not GM, do nothing.
  if (!game.user.isGM) return;

  //  Get currnet Escalation level.
  let el = game.archmage.ArchmageUtility.getEscalation();

  //  If the Escalation level has not changed, do nothing.
  if (el === game.settings.get("13th-age-combat-loops", "elPrevious")) return;

  //
  //  Passed all tests, run main code
  //

  //  ---------------------------------------------------------------------------
  //  ISSUES
  //  1. The following const variables are going to be created and destroyed every time.
  //     Inefficient.
  //  2. The playlist and sound lookups will happen every time.
  //     Excessive traffic.
  //
  //  It seems like this would be better to run just once when the module is loaded,
  //  but I don't know how to do that properly.
  //  ---------------------------------------------------------------------------
  //
  //  Get playlist and sounds
  const playlist = game.playlists.getName('13th Age Combat Loops');
  const elCombatLoops = [
    "Escalation 0 Loop",
    "Escalation 1 Loop",
    "Escalation 2 Loop",
    "Escalation 3 Loop",
    "Escalation 4 Loop",
    "Escalation 5 Loop",
    "Escalation 6 Loop",
  ];

  // Stop the playlist.
  playlist.stopAll();

  //  Play track based on the current Escalation level
  sound = playlist.sounds.getName(elCombatLoops[el]);
  playlist.playSound(sound);

  //  Store current Escalation level for next time.
  game.settings.set("13th-age-combat-loops", "elPrevious", el);

});

Hooks.on('deleteCombat', (combat) => {
  if (!game.user.isGM) return;
  //  Clean up
  //  Stop playlist and set previous to -1
  game.settings.set("13th-age-combat-loops", "elPrevious", -1)
  game.playlists.getName('13th Age Combat Loops').stopAll();
});