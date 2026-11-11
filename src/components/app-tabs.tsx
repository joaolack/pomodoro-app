import { NativeTabs } from 'expo-router/native-tabs';

export default function AppTabs() {
    return (
        <NativeTabs minimizeBehavior="onScrollDown">
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>início</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon md={{ default: 'home', selected: 'home_filled'}} />
            </NativeTabs.Trigger>

        </NativeTabs>
    );    
}