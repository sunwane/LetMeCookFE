import { CommentItem } from '@/services/types/CommentItem';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CommentPost {
  item: CommentItem;
}

const OneCmtPost: React.FC<CommentPost> = ({ item }) => {

    const [isLiked, setIsLiked] = useState(false);
    
    const toggleLike = () => {
        setIsLiked(!isLiked);
    };
    
  return (
    <View style={styles.postContent}>
        <View style={styles.top}>
            <View style={styles.infor}>
                <Image
                    source={{uri: item.account.avatar}}
                    style={styles.avatar}
                />
                <View>
                    <View style={styles.row}>
                        <TouchableOpacity>
                            <Text style={styles.nameDisplay}>{item.account.userName} </Text> 
                        </TouchableOpacity>
                        <Text>đã nấu món</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.foodTitle}>{item.recipe.foodName}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        <View style={styles.des}>
            <Text>
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
                    style={styles.icon}/>
                    <Text style={styles.iconText}>{item.like} người đã thích</Text>
                    </View>
            </TouchableOpacity>
            <TouchableOpacity>
                <View style={styles.bot}>
                    <Image
                    source={require('@/assets/images/icons/Error.png')}
                    style = {styles.icon}
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
        height: 55,
        width: 55,
        borderRadius: 50,
    },
    nameDisplay: {
        color: '#FF5D00',
        fontWeight: 700,
    },
    foodTitle: {
        fontSize: 18,
        fontWeight: 700,
        color: '#7A2917'
    },
    foodImage: {
        width: '100%',
        height: 300,
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
        fontWeight: 600,
        color: 'rgba(112,41,23,0.8)'
    },
    des: {
        marginBottom: 15,
        marginHorizontal: 14,
    },
})