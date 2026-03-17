import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
                    <LinearGradient
                        colors={['#7d6b2fff', '#c1a552ff']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.header}>
                        <View style={styles.avatarPlaceholder}>
                            <LinearGradient
                                colors={['#555', '#444444ff', '#413f3fff']}
                                start={{ x: 0.2, y: 0.2 }}
                                end={{ x: 0.8, y: 0.8 }}
                                style={styles.avatarGradient}
                            />
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
                    <LinearGradient
                        colors={['#8A7730', '#B9993A']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFillObject}
                    />
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
        height: 220,
        marginBottom: 24,
        shadowColor: '#201f1fff',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    card: {
        backgroundColor: 'transparent',
        borderRadius: 20,
        padding: 24,
        height: 230,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)', // subtle reflection
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
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#dab12aff', // Warmer gold ring
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 12, // Softer, more glowing shadow
        elevation: 10,
    },
    avatarGradient: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 50,
    },
    avatarText: {
        color: '#a1a1a1ff',
        fontSize: 42,
        fontWeight: '700',
        letterSpacing: 1.5,
        zIndex: 2,
    },
    statusContainer: {
        alignItems: 'flex-end',
    },
    statusLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        letterSpacing: 1.5,
        marginBottom: 4,
        fontWeight: '500',
    },
    statusValue: {
        color: '#f0ba0aff',
        fontSize: 28,
        fontWeight: '600',
        letterSpacing: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        zIndex: 2,
    },
    name: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    userId: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        letterSpacing: 1,
    },
    logo: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 2.5,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.08)', // Slightly darker vignette for perfect white text contrast
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.02)', // Inner texture
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
        fontSize: 16,
        fontWeight: '600',
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
