import { NativeTabs } from 'expo-router/native-tabs';
import { colors } from '@/theme';

const progressBarOutline = require('@/assets/images/tabs/progress.png');
const progressBarFilled = require('@/assets/images/tabs/progress-filled.png');
const timerOutline = require('@/assets/images/tabs/timer-outline.png');
const timerFilled = require('@/assets/images/tabs/timer-filled.png');
const settingsOutline = require('@/assets/tabs/settings/settings-outline.png');
const settingsFilled = require('@/assets/tabs/settings/settings-filled.png');


export default function AppTabs() {
    return (
        <NativeTabs
            minimizeBehavior="onScrollDown"
            backgroundColor={colors.background}
            tintColor={colors.text}
            iconColor={{ default: colors.textMuted, selected: colors.text }}
            labelStyle={{
                default: { color: colors.textMuted, fontSize: 12 },
                selected: { color: colors.text, fontSize: 12, fontWeight: '700' },
            }}
            indicatorColor={colors.surface}
        >
            <NativeTabs.Trigger name='progress'>
                <NativeTabs.Trigger.Label>Progresso</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon 
                    sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }}
                    src={{ default: progressBarOutline, selected: progressBarFilled }}  
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>Foco</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    sf={{ default: 'stopwatch', selected: 'stopwatch.fill' }}
                    src={{ default: timerOutline, selected: timerFilled }}
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name='settings'>
                <NativeTabs.Trigger.Label>Config.</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon 
                    sf={{ default: 'slider.horizontal.3', selected: 'slider.horizontal.3' }}
                    src={{ default: settingsOutline, selected: settingsFilled }}  
                />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
