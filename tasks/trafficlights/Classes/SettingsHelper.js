export class SettingsHelper {
  static roadCountX = 8
  static roadCountY = 4
  static roadLen = 60
  static roadWidth = 30

  static setSettings (settings) {
    // console.log('setSettings()');

    var levelSettings
    settings.levels = {}

    // -----------level 0 -----------
    levelSettings = new Object()
    levelSettings.level = 0
    levelSettings.startCrossId = '0:0'
    levelSettings.finishCrossId = '0:0'
    levelSettings.roadWidth = SettingsHelper.roadWidth
    levelSettings.roadLen = SettingsHelper.roadLen
    levelSettings.roadCountX = 6
    levelSettings.roadCountY = 4
    levelSettings.blocks = ['1V1', '1H2', '3H3']
    levelSettings.points = {}
    levelSettings.svets = {
      '0:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT'],
      '0:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT'],
      '0:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT'],
      '1:0': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '1:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '1:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '1:4': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '2:0': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '2:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '2:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-T;R-R'],
      '2:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '2:4': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '3:0': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '3:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '3:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-T;R-R'],
      '3:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '3:4': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '4:0': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '4:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '4:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-T;R-R'],
      '4:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '4:4': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '5:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT'],
      '5:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT'],
      '5:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT']
    }

    settings.levels[levelSettings.level] = levelSettings

    // -----------level 1 -----------
    levelSettings = new Object()
    levelSettings.level = 1
    levelSettings.startCrossId = '0:0'
    levelSettings.finishCrossId = '0:0'
    levelSettings.roadWidth = SettingsHelper.roadWidth
    levelSettings.roadLen = SettingsHelper.roadLen
    levelSettings.roadCountX = 8
    levelSettings.roadCountY = 4
    levelSettings.blocks = ['1V1', '1H2', '3H3', '5V3', '6V3']
    levelSettings.svets = {
      '0:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT'],
      '0:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT'],
      '0:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT'],
      '1:0': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '1:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '1:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '1:4': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '2:0': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '2:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '2:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-T;R-R'],
      '2:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '2:4': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '3:0': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '3:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '3:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-T;R-R'],
      '3:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '3:4': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '4:0': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '4:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '4:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-T;R-R'],
      '4:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '4:4': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '5:0': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '5:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT'],
      '5:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-T;R-R'],
      '5:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '6:0': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '6:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '6:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-T;R-R'],
      '6:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '7:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT'],
      '7:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT'],
      '7:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT']
    }

    levelSettings.points = {}

    settings.levels[levelSettings.level] = levelSettings

    // -----------level 2 -----------
    levelSettings = new Object()
    levelSettings.level = 2
    levelSettings.startCrossId = '0:0'
    levelSettings.finishCrossId = '0:0'
    levelSettings.roadWidth = SettingsHelper.roadWidth
    levelSettings.roadLen = SettingsHelper.roadLen
    levelSettings.roadCountX = 9
    levelSettings.roadCountY = 4
    levelSettings.blocks = ['1V1', '1H2', '3H3', '5V3', '6V3']
    levelSettings.svets = {
      '0:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT'],
      '0:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT'],
      '0:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT'],
      '1:0': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '1:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '1:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '1:4': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '2:0': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '2:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '2:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-T;R-R'],
      '2:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '2:4': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '3:0': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '3:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '3:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-T;R-R'],
      '3:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '3:4': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '4:0': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '4:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '4:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-T;R-R'],
      '4:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '4:4': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '5:0': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '5:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT'],
      '5:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-T;R-R'],
      '5:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '5:4': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '6:0': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '6:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '6:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-T;R-R'],
      '6:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '6:4': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '7:0': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '7:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '7:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-T;R-R'],
      '7:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT'],
      '7:4': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'L-RTB;R-TBL'],
      '8:1': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT'],
      '8:2': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT'],
      '8:3': ['L-RTB;R-TBL', 'T-LRB;B-LRT', 'T-LRB;B-LRT']
    }

    levelSettings.points = {}

    settings.levels[levelSettings.level] = levelSettings
  }
}
