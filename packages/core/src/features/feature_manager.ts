


export class FeatureManager {

	private available_features: string[] = [];
	private enabled_features: string[] = [];

	constructor() {
		
	}

	enableFeature(featureName :string) {

	}

	disableFeature(featureName :string) {
		
	}
	
	checkFeature(featureName :string) {
		return this.enabled_features.includes(featureName);
	}
}