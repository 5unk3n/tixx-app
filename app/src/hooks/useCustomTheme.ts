import { useTheme } from 'react-native-paper'

import { CustomTheme } from '@/theme/defaultTheme'

export const useCustomTheme = () => useTheme<CustomTheme>()
