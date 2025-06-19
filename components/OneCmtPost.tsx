import '@/config/globalTextConfig'; // Import để áp dụng cấu hình toàn cục cho Text và TextInput
import { CommentItem } from '@/services/types/CommentItem';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CommentPost {
  item: CommentItem;
  currentUserId?: number; // ID của user hiện tại
}

const OneCmtPost: React.FC<CommentPost> = ({ item, currentUserId = 1 }) => {
    const [isLiked, setIsLiked] = useState(false);
    
    const toggleLike = () => {
        setIsLiked(!isLiked);
    };

    const handleUserPress = () => {
        if (item.account.id === currentUserId) {
            // Nếu là tài khoản hiện tại, chuyển sang tab Profile
        } else {
            // Nếu là tài khoản khác, mở UserProfile với layout stack
            router.push({
                pathname: '/UserProfile',
                params: { userId: item.account.id.toString() }
            });
        }
    };
    
    return (
        <View style={styles.postContent}>
            <View style={styles.top}>
                <View style={styles.infor}>
                    <TouchableOpacity onPress={handleUserPress}>
                        <Image
                            source={{uri: item.account.avatar}}
                            style={styles.avatar}
                        />
                    </TouchableOpacity>
                    <View>
                        <View style={styles.row}>
                            <TouchableOpacity onPress={handleUserPress}>
                                <Text style={[
                                    styles.nameDisplay
                                ]}>
                                    {item.account.userName}
                                </Text> 
                            </TouchableOpacity>
                            <Text> đã nấu món</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.foodTitle}>{item.recipe.foodName}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.des}>
                <Text style={styles.description}>
                    {item.content}
                </Text>
            </View>
            <View style={styles.mid}>
                <Image
                    source={{uri: item.recipe.imageUrl}}
                    style={styles.foodImage}
                />
            </View>
            <View style={[styles.bot]}>
                <TouchableOpacity onPress={toggleLike}>
                    <View style={styles.bot}>
                        <Image
                            source={
                                isLiked 
                                ? require('@/assets/images/icons/Like_Active.png')
                                : require('@/assets/images/icons/Like.png')
                            }
                            style={styles.icon}
                        />
                        <Text style={styles.iconText}>{item.like} người đã thích</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={styles.bot}>
                        <Image
                            source={require('@/assets/images/icons/Error.png')}
                            style={styles.icon}
                        />
                        <Text style={styles.iconText}>Báo cáo</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default OneCmtPost

const styles = StyleSheet.create({
    postContent: {
        backgroundColor: '#fff',
        borderBottomColor: '#cecece',
        borderTopColor: '#cecece',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingVertical: 15,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
    },
    top: {
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    infor: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 50,
    },
    nameDisplay: {
        color: '#FF5D00',
        fontWeight: '700',
    },
    foodTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#7A2917'
    },
    foodImage: {
        width: '100%',
        height: 200,
    },
    mid: {
        position: 'relative',
    },
    bot: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        marginTop: 7,
        paddingHorizontal: 10,
    },
    icon: {
        width: 20,
        height: 20,
        tintColor: '#7A2917',
    },
    iconText: {
        fontSize: 15,
        fontWeight: '600',
        color: 'rgba(112,41,23,0.8)'
    },
    des: {
        marginBottom: 15,
        marginHorizontal: 14,
    },
    description: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
    },
})