import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback, Image } from 'react-native';

interface MemberCardProps {
    name: string;
    userId: string;
    status: 'Gold' | 'Silver' | 'Platinum';
}

const MemberCard: React.FC<MemberCardProps> = ({ name, userId, status }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const flipAnim = useRef(new Animated.Value(0)).current;

    const flipCard = () => {
        Animated.spring(flipAnim, {
            toValue: isFlipped ? 0 : 1,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
        setIsFlipped(!isFlipped);
    };

    // Front side rotation: 0deg -> 180deg
    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    // Back side rotation: 180deg -> 360deg
    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    const frontOpacity = flipAnim.interpolate({
        inputRange: [0, 0.5, 0.5, 1],
        outputRange: [1, 1, 0, 0],
    });

    const backOpacity = flipAnim.interpolate({
        inputRange: [0, 0.5, 0.5, 1],
        outputRange: [0, 0, 1, 1],
    });

    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=NITEWAYS-MEMBER:${encodeURIComponent(userId)}`;

    return (
        <TouchableWithoutFeedback onPress={flipCard}>
            <View style={styles.cardWrapper}>
                {/* Front Side */}
                <Animated.View
                    style={[
                        styles.card,
                        styles.cardFront,
                        {
                            transform: [{ rotateY: frontInterpolate }],
                            opacity: frontOpacity,
                        },
                    ]}
                >
                    <View style={styles.header}>
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{initials}</Text>
                        </View>
                        <View style={styles.statusContainer}>
                            <Text style={styles.statusLabel}>MEMBER STATUS</Text>
                            <Text style={styles.statusValue}>{status}</Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <View>
                            <Text style={styles.name}>{name}</Text>
                            <Text style={styles.userId}>{userId}</Text>
                        </View>
                        <Text style={styles.logo}>NITEWAYS</Text>
                    </View>

                    <View style={styles.overlay} />
                </Animated.View>

                {/* Back Side */}
                <Animated.View
                    style={[
                        styles.card,
                        styles.cardBack,
                        {
                            transform: [{ rotateY: backInterpolate }],
                            opacity: backOpacity,
                        },
                    ]}
                >
                    <View style={styles.qrContainer}>
                        <View style={styles.qrWrapper}>
                            <Image
                                source={{ uri: qrUrl }}
                                style={styles.qrImage}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.backUserId}>{userId}</Text>
                        <Text style={styles.backLogo}>NITEWAYS</Text>
                    </View>

                    <View style={styles.overlay} />
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        height: 200,
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#8B7D3C',
        borderRadius: 16,
        padding: 20,
        height: 200,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
    },
    cardFront: {
        justifyContent: 'space-between',
        zIndex: 2,
    },
    cardBack: {
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        zIndex: 2,
    },
    avatarPlaceholder: {
        width: 75,
        height: 75,
        borderRadius: 38,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#8B6914',
    },
    avatarText: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
    },
    statusContainer: {
        alignItems: 'flex-end',
    },
    statusLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        letterSpacing: 1,
        marginBottom: 4,
    },
    statusValue: {
        color: '#D4A843',
        fontSize: 24,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        zIndex: 2,
    },
    name: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userId: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },
    logo: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.1)',
        zIndex: 1,
    },
    // Back side styles
    qrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    qrWrapper: {
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
    },
    qrImage: {
        width: 120,
        height: 120,
    },
    backUserId: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 4,
    },
    backLogo: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
});

export default MemberCard;
