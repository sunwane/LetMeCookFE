import CategoryScreen from '@/app/CategoryScreen';
import CommunityScreen from '@/app/CommunityScreen';
import HomeScreen from '@/app/HomeScreens';
import ProfileScreen from '@/app/ProfileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text } from 'react-native';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          height: 90,
          paddingBottom: 40,
        },
        tabBarActiveTintColor: '#FF5D00',
        tabBarInactiveTintColor: 'rgba(0, 0, 0, 0.5)',
        tabBarLabel: ({ focused, color }) => (
          <Text
            style={[
              {
                fontSize: 12,
                fontWeight: '500',
                color: color,
              },
              focused && {
                textShadowColor: 'rgba(255, 93, 0, 0.5)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 3,
              }
            ]}
          >
            {route.name}
          </Text>
        )
      })}
    >
      <Tab.Screen 
        name="Khám phá" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused 
                ? require('@/assets/images/icons/Home_Active.png')
                : require('@/assets/images/icons/Home.png')
              }
              style={{ width: 24, height: 24 }}
            />
          )
        }}
      />
      <Tab.Screen 
        name="Thể loại" 
        component={CategoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused 
                ? require('@/assets/images/icons/Category_Active.png')
                : require('@/assets/images/icons/Category.png')
              }
              style={{ width: 24, height: 24 }}
            />
          )
        }}
      />
      <Tab.Screen 
        name="Cộng đồng" 
        component={CommunityScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused 
                ? require('@/assets/images/icons/Community_Active.png')
                : require('@/assets/images/icons/Community.png')
              }
              style={{ width: 24, height: 24 }}
            />
          )
        }}
      />
      <Tab.Screen 
        name="Tài khoản" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused 
                ? require('@/assets/images/icons/Profile_Active.png')
                : require('@/assets/images/icons/Profile.png')
              }
              style={{ width: 24, height: 24 }}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;