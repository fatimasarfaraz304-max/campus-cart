import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text, View } from 'react-native'
import { useAuth } from '../hooks/useAuth'
import { colors, radius } from '../constants/theme'

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen'
import SignupScreen from '../screens/auth/SignupScreen'

// Main screens
import HomeScreen from '../screens/main/HomeScreen'
import SellScreen from '../screens/main/SellScreen'
import ChatScreen from '../screens/main/ChatScreen'
import ProfileScreen from '../screens/main/ProfileScreen'
import NoticesScreen from '../screens/main/NoticesScreen'
import ListingDetailScreen from '../screens/listing/ListingDetailScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      <Text style={{ fontSize: focused ? 20 : 18 }}>{emoji}</Text>
      <Text style={{ fontSize: 9, color: focused ? colors.primary : '#FFCCBC', fontWeight: focused ? '600' : '400' }}>{label}</Text>
    </View>
  )
}

function SellTabIcon({ focused }) {
  return (
    <View style={{
      width: 44, height: 44, borderRadius: 14,
      backgroundColor: colors.primary,
      alignItems: 'center', justifyContent: 'center',
      marginTop: -18,
    }}>
      <Text style={{ fontSize: 22, color: '#fff' }}>+</Text>
    </View>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1.5,
          borderTopColor: colors.border,
          paddingTop: 4,
          paddingBottom: 6,
          height: 58,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} /> }} />
      <Tab.Screen name="Browse" component={BrowseStack} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🔍" label="Browse" focused={focused} /> }} />
      <Tab.Screen name="Sell" component={SellScreen} options={{ tabBarIcon: ({ focused }) => <SellTabIcon focused={focused} /> }} />
      <Tab.Screen name="Chats" component={ChatsScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💬" label="Chats" focused={focused} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} /> }} />
    </Tab.Navigator>
  )
}

// Placeholder screens (built next)
function BrowseStack() {
  const S = createNativeStackNavigator()
  return (
    <S.Navigator screenOptions={{ headerShown: false }}>
      <S.Screen name="BrowseMain" component={require('../screens/main/BrowseScreen').default} />
    </S.Navigator>
  )
}

function ChatsScreen() {
  return require('../screens/main/ChatsListScreen').default()
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  )
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Notices" component={NoticesScreen} />
    </Stack.Navigator>
  )
}

export default function Navigation() {
  const { user, loading } = useAuth()
  if (loading) return null
  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}
