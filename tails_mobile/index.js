/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { AppContext, useAppState } from './store';
<style>
  @import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Bowlby+One+SC&family=Rammetto+One&display=swap');
</style>

const Provider = ({ children }) => (
	<AppContext.Provider value={useAppState()}>
		{children}
	</AppContext.Provider>
);

export default function Project() {
	return (
		<Provider>

			<App />
		</Provider>

	)
}

AppRegistry.registerComponent(appName, () => Project);
