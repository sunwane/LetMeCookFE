import '@/config/globalTextConfig';
import { CommentItem, getAllAccountLikeComment, likeComment, unlikeComment } from '@/services/types/CommentItem';
import { createFavoriteRecipe, deleteFavoriteRecipe, getAllFavouriteRecipe } from '@/services/types/FavoritesRecipe';
import { getAllRecipeAccoountLike, getRecipeById } from '@/services/types/RecipeItem';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReportModal from './ReportModal';

interface CommentPost {
  item: CommentItem;
  currentUserId?: number;
}

const OneCmtPost: React.FC<CommentPost> = ({ item, currentUserId = 1 }) => {
    const navigation = useNavigation();
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
    const [reportModalVisible, setReportModalVisible] = useState(false); // State cho report modal
    const [likeCount, setLikeCount] = useState(item.likes ?? 0);
    const [isCommentLiked, setIsCommentLiked] = useState(false);


 React.useEffect(() => {
    const checkLikeStatus = async () => {
        try {
            const response = await getAllRecipeAccoountLike(item.recipeId.toString());
            if (response?.result && Array.isArray(response.result)) {
                const isInLikes = response.result.some(like =>
                    like.recipeId === item.recipeId
                );
                setIsLiked(isInLikes);
            }
        } catch (error) {
            console.error('Error checking like status:', error);
            setIsLiked(false);
        }
    };

    if (item?.recipeId) {
        checkLikeStatus();
    }
}, [item?.recipeId]);

    // Kiểm tra bookmark status từ database
    React.useEffect(() => {
        const checkBookmarkStatus = async () => {
            try {
                const response = await getAllFavouriteRecipe();
                if (response?.result && Array.isArray(response.result)) {
                    const isInFavorites = response.result.some(favorite =>
                        favorite.recipeId?.toString() === item.recipeId
                    );
                    setIsBookmarked(isInFavorites);
                }
            } catch (error) {
                console.error('Error checking bookmark status:', error);
                setIsBookmarked(false);
            }
        };

        if (item?.recipeId) {
            checkBookmarkStatus();
        }
    }, [item?.recipeId]);
    
    React.useEffect(() => {
        const checkLikeStatus = async () => {
            try {
                const response = await getAllAccountLikeComment();
                if (response?.result && Array.isArray(response.result)) {
                    const isInLikes = response.result.some(like =>
                        like.commentId?.toString() === item.id?.toString()
                    );
                    setIsCommentLiked(isInLikes);
                } else {
                    setIsCommentLiked(false);
                }
            } catch (error) {
                console.error('Error checking comment like status:', error);
                setIsCommentLiked(false);
            }
        };

        if (item?.id) {
            checkLikeStatus();
        }
    }, [item?.id]);


    const toggleBookmark = async () => {
        if (isBookmarkLoading || !item.recipeId) return; // Ngăn double click
        setIsBookmarkLoading(true);

        try {
            if (isBookmarked) {
                await deleteFavoriteRecipe(item.recipeId.toString());
                setIsBookmarked(false);
                console.log(`Recipe removed from bookmarks`);
            } else {
                await createFavoriteRecipe(item.recipeId.toString());
                setIsBookmarked(true);
                console.log(`Recipe saved to bookmarks`);
            }
        } catch (error) {
            console.error('Lỗi khi xử lý bookmark:', error);
            // Có thể revert lại trạng thái nếu muốn
            // setIsBookmarked(!isBookmarked);
        } finally {
            setIsBookmarkLoading(false);
        }
    };

    const toggleLike = async () => {
        if (isLikeLoading) return;
        setIsLikeLoading(true);
        try {
            if (isCommentLiked) {
                await unlikeComment(item.id.toString());
                setIsCommentLiked(false);
                setLikeCount(prev => Math.max(0, prev - 1));
            } else {
                await likeComment(item.id.toString());
                setIsCommentLiked(true);
                setLikeCount(prev => prev + 1);
            }
        } catch {
            Alert.alert('Lỗi', 'Không thể thực hiện thao tác!');
        } finally {
            setIsLikeLoading(false);
        }
    };

    const handleReport = () => {
        setReportModalVisible(true);
    };

    const handleUserPress = () => {
        if (item.account.id === currentUserId.toString()) {
            navigation.navigate('Tài khoản' as never);
        } else {
            router.push({
                pathname: '/UserProfile',
                params: { userId: item.accountId.toString() }
            });
        }
    };

    const handleRecipePress = async () => {
        try {
            const response = await getRecipeById(item.recipeId.toString());
            if (response && response.result) {
                console.log('Recipe data fetched successfully:', response.result);
                router.push({
                    pathname: '/RecipeScreen',
                    params: {
                        recipeData: JSON.stringify(response.result)
                    }
                });
            } else {
                // fallback nếu không lấy được recipe
                router.push({
                    pathname: '/RecipeScreen',
                    params: {
                        recipeData: JSON.stringify(item.recipe)
                    }
                });
            }
        } catch (error) {
            // fallback nếu lỗi
            router.push({
                pathname: '/RecipeScreen',
                params: {
                    recipeData: JSON.stringify(item.recipe)
                }
            });
        }
    };

    return (
        <>
            <View style={styles.postContent}>
                <View style={styles.top}>
                    <View style={styles.infor}>
                        <TouchableOpacity onPress={handleUserPress}>

                            {/* đọc lại Avatar và username nha dũng */}
                            <Image
                                source={{uri: item.userAvatar}}
                                style={styles.avatar}
                            />
                        </TouchableOpacity>
                        <View>
                            <View style={styles.row}>
                                <TouchableOpacity onPress={handleUserPress}>
                                    <Text style={styles.nameDisplay}>
                                        {item.username}
                                    </Text> 
                                </TouchableOpacity>
                                <Text> đã nấu món</Text>
                            </View>
                            <TouchableOpacity onPress={handleRecipePress}>
                                <Text style={styles.foodTitle}>{item.recipeTitle}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.des}>
                    <Text style={styles.description}>
                        {item.commentText}
                    </Text>
                </View>
                <TouchableOpacity style={styles.mid} onPress={handleRecipePress}>
                    <Image
                        source={{uri: item.recipeImage}}
                        style={styles.foodImage}
                    />
                    {/* Bookmark button overlay */}
                    <TouchableOpacity 
                        style={styles.bookmarkButton} 
                        onPress={toggleBookmark}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={
                                isBookmarked 
                                ? require('@/assets/images/icons/Bookmark_Active.png')
                                : require('@/assets/images/icons/Bookmark.png')
                            }
                            style={styles.bookmarkIcon}
                        />
                        <Text style={styles.bookmarkText}>Lưu công thức</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
                <View style={[styles.bot]}>
                    <TouchableOpacity onPress={toggleLike}>
                        <View style={styles.bot}>
                            <Image
                                source={
                                    isCommentLiked 
                                    ? require('@/assets/images/icons/Like_Active.png')
                                    : require('@/assets/images/icons/Like.png')
                                }
                                style={styles.icon}
                            />
                            <Text style={styles.iconText}>{likeCount} người đã thích</Text>
                        </View>
                    </TouchableOpacity>
                    {/* Report Button với Modal */}
                    <TouchableOpacity onPress={handleReport}>
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

            {/* Report Modal */}
            <ReportModal
                visible={reportModalVisible}
                onClose={() => setReportModalVisible(false)}
                userName={item.username}
            />
        </>
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
        height: 220,
    },
    mid: {
        position: 'relative',
    },
    // Bookmark button styles
    bookmarkButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(122, 41, 23,0.7)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 6,
    },
    bookmarkIcon: {
        width: 10,
        height: 15,
        tintColor: '#fff',
    },
    bookmarkText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
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
});