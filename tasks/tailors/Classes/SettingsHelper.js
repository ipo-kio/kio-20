export class SettingsHelper{
	static setSettings (settings){
		var levelSettings
		settings.levels = {}

		// -----------level 0 -----------
		levelSettings = new Object()
		levelSettings.level = 0
		levelSettings.timeInSec = 60
		levelSettings.timeReloadInSec = 1

		settings.levels[levelSettings.level] = levelSettings

		// -----------level 1 -----------
		levelSettings = new Object()
		levelSettings.level = 1
		levelSettings.timeInSec = 60
		levelSettings.timeReloadInSec = 2

		settings.levels[levelSettings.level] = levelSettings

		// -----------level 2 -----------
		levelSettings = new Object()
		levelSettings.level = 2
		levelSettings.timeInSec = 60
		levelSettings.timeReloadInSec = 3

		settings.levels[levelSettings.level] = levelSettings
	}
}