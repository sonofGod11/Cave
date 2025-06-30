"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import Link from "next/link";

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: 'cashback' | 'discount' | 'free_service' | 'gift_card' | 'charity';
  image: string;
  isAvailable: boolean;
  expiryDate?: string;
  maxRedemptions?: number;
  currentRedemptions: number;
}

interface UserRewards {
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  totalTransactions: number;
  joinDate: string;
  achievements: Achievement[];
  redeemedRewards: RedeemedReward[];
  referralCode: string;
  referredUsers: number;
  streakDays: number;
  lastTransactionDate: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedDate?: string;
  progress: number;
  maxProgress: number;
}

interface RedeemedReward {
  id: string;
  rewardId: string;
  rewardName: string;
  pointsSpent: number;
  redeemedDate: string;
  status: 'active' | 'used' | 'expired';
  expiryDate?: string;
  code?: string;
}

interface Transaction {
  id: string;
  amount: number;
  service: string;
  date: string;
  pointsEarned: number;
  bonusPoints?: number;
}

const rewardCategories = [
  { value: 'all', label: 'All Rewards', icon: '🎁' },
  { value: 'cashback', label: 'Cashback', icon: '💰' },
  { value: 'discount', label: 'Discounts', icon: '🏷️' },
  { value: 'free_service', label: 'Free Services', icon: '🎯' },
  { value: 'gift_card', label: 'Gift Cards', icon: '💳' },
  { value: 'charity', label: 'Charity', icon: '❤️' }
];

const tierBenefits = {
  bronze: {
    name: 'Bronze',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    pointsMultiplier: 1,
    benefits: ['1x Points on transactions', 'Basic rewards access'],
    minSpent: 0
  },
  silver: {
    name: 'Silver',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    pointsMultiplier: 1.2,
    benefits: ['1.2x Points on transactions', 'Exclusive rewards', 'Birthday bonus'],
    minSpent: 1000
  },
  gold: {
    name: 'Gold',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    pointsMultiplier: 1.5,
    benefits: ['1.5x Points on transactions', 'Premium rewards', 'Priority support', 'Free monthly service'],
    minSpent: 5000
  },
  platinum: {
    name: 'Platinum',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    pointsMultiplier: 2,
    benefits: ['2x Points on transactions', 'VIP rewards', 'Dedicated support', 'Free services', 'Exclusive events'],
    minSpent: 10000
  }
};

const achievements = [
  {
    id: 'first_payment',
    name: 'First Payment',
    description: 'Complete your first payment',
    icon: '🎉',
    maxProgress: 1
  },
  {
    id: 'payment_streak_7',
    name: 'Week Warrior',
    description: 'Make payments for 7 consecutive days',
    icon: '🔥',
    maxProgress: 7
  },
  {
    id: 'payment_streak_30',
    name: 'Monthly Master',
    description: 'Make payments for 30 consecutive days',
    icon: '👑',
    maxProgress: 30
  },
  {
    id: 'spend_1000',
    name: 'Big Spender',
    description: 'Spend ₵1,000 total',
    icon: '💎',
    maxProgress: 1000
  },
  {
    id: 'spend_5000',
    name: 'High Roller',
    description: 'Spend ₵5,000 total',
    icon: '🏆',
    maxProgress: 5000
  },
  {
    id: 'refer_5',
    name: 'Social Butterfly',
    description: 'Refer 5 friends',
    icon: '🦋',
    maxProgress: 5
  },
  {
    id: 'redeem_10',
    name: 'Reward Hunter',
    description: 'Redeem 10 rewards',
    icon: '🎯',
    maxProgress: 10
  },
  {
    id: 'perfect_month',
    name: 'Perfect Month',
    description: 'Make at least one payment every day for a month',
    icon: '⭐',
    maxProgress: 30
  }
];

const rewards: Reward[] = [
  {
    id: 'cashback_5',
    name: '₵5 Cashback',
    description: 'Get ₵5 credited to your account',
    pointsCost: 500,
    category: 'cashback',
    image: '💰',
    isAvailable: true,
    currentRedemptions: 0
  },
  {
    id: 'cashback_10',
    name: '₵10 Cashback',
    description: 'Get ₵10 credited to your account',
    pointsCost: 900,
    category: 'cashback',
    image: '💰',
    isAvailable: true,
    currentRedemptions: 0
  },
  {
    id: 'discount_10_percent',
    name: '10% Discount',
    description: 'Get 10% off your next payment',
    pointsCost: 300,
    category: 'discount',
    image: '🏷️',
    isAvailable: true,
    currentRedemptions: 0
  },
  {
    id: 'free_electricity',
    name: 'Free Electricity Bill',
    description: 'Pay one electricity bill for free (up to ₵50)',
    pointsCost: 800,
    category: 'free_service',
    image: '⚡',
    isAvailable: true,
    currentRedemptions: 0
  },
  {
    id: 'free_water',
    name: 'Free Water Bill',
    description: 'Pay one water bill for free (up to ₵30)',
    pointsCost: 600,
    category: 'free_service',
    image: '💧',
    isAvailable: true,
    currentRedemptions: 0
  },
  {
    id: 'mtn_voucher',
    name: 'MTN ₵20 Voucher',
    description: 'Get ₵20 MTN airtime voucher',
    pointsCost: 400,
    category: 'gift_card',
    image: '📱',
    isAvailable: true,
    currentRedemptions: 0
  },
  {
    id: 'vodafone_voucher',
    name: 'Vodafone ₵20 Voucher',
    description: 'Get ₵20 Vodafone airtime voucher',
    pointsCost: 400,
    category: 'gift_card',
    image: '📱',
    isAvailable: true,
    currentRedemptions: 0
  },
  {
    id: 'charity_donation',
    name: 'Charity Donation',
    description: 'Donate ₵10 to a local charity',
    pointsCost: 200,
    category: 'charity',
    image: '❤️',
    isAvailable: true,
    currentRedemptions: 0
  },
  {
    id: 'premium_support',
    name: 'Premium Support',
    description: 'Get priority customer support for 30 days',
    pointsCost: 150,
    category: 'free_service',
    image: '🎧',
    isAvailable: true,
    currentRedemptions: 0
  },
  {
    id: 'double_points_week',
    name: 'Double Points Week',
    description: 'Earn double points on all transactions for 7 days',
    pointsCost: 1000,
    category: 'free_service',
    image: '⚡',
    isAvailable: true,
    currentRedemptions: 0
  }
];

export default function Rewards() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'achievements' | 'history'>('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [userRewards, setUserRewards] = useState<UserRewards>({
    points: 1250,
    tier: 'silver',
    totalSpent: 3500,
    totalTransactions: 45,
    joinDate: '2024-01-15',
    achievements: [],
    redeemedRewards: [],
    referralCode: 'CAVE' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    referredUsers: 3,
    streakDays: 12,
    lastTransactionDate: '2024-06-29'
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    {
      id: 'txn_1',
      amount: 150,
      service: 'ECG Electricity',
      date: '2024-06-29',
      pointsEarned: 15,
      bonusPoints: 3
    },
    {
      id: 'txn_2',
      amount: 80,
      service: 'GWCL Water',
      date: '2024-06-28',
      pointsEarned: 8
    },
    {
      id: 'txn_3',
      amount: 200,
      service: 'MTN Mobile Money',
      date: '2024-06-27',
      pointsEarned: 20,
      bonusPoints: 5
    }
  ]);

  // Load user rewards from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('cave_user_rewards');
    if (stored) {
      setUserRewards(JSON.parse(stored));
    } else {
      // Initialize with default data
      const defaultRewards: UserRewards = {
        points: 1250,
        tier: 'silver',
        totalSpent: 3500,
        totalTransactions: 45,
        joinDate: '2024-01-15',
        achievements: achievements.map(achievement => ({
          ...achievement,
          isUnlocked: ['first_payment', 'spend_1000', 'refer_5'].includes(achievement.id),
          progress: achievement.id === 'first_payment' ? 1 : 
                   achievement.id === 'spend_1000' ? 3500 : 
                   achievement.id === 'refer_5' ? 3 : 0,
          unlockedDate: ['first_payment', 'spend_1000', 'refer_5'].includes(achievement.id) ? 
                       new Date().toISOString() : undefined
        })),
        redeemedRewards: [],
        referralCode: 'CAVE' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        referredUsers: 3,
        streakDays: 12,
        lastTransactionDate: '2024-06-29'
      };
      localStorage.setItem('cave_user_rewards', JSON.stringify(defaultRewards));
      setUserRewards(defaultRewards);
    }
  }, []);

  // Save user rewards to localStorage
  const saveUserRewards = (newRewards: UserRewards) => {
    localStorage.setItem('cave_user_rewards', JSON.stringify(newRewards));
    setUserRewards(newRewards);
  };

  // Filter rewards by category
  const filteredRewards = rewards.filter(reward => 
    selectedCategory === 'all' || reward.category === selectedCategory
  );

  // Calculate tier based on total spent
  const calculateTier = (totalSpent: number): 'bronze' | 'silver' | 'gold' | 'platinum' => {
    if (totalSpent >= 10000) return 'platinum';
    if (totalSpent >= 5000) return 'gold';
    if (totalSpent >= 1000) return 'silver';
    return 'bronze';
  };

  // Redeem reward
  const redeemReward = () => {
    if (!selectedReward) return;

    if (userRewards.points < selectedReward.pointsCost) {
      alert('Insufficient points to redeem this reward');
      return;
    }

    const newRedeemedReward: RedeemedReward = {
      id: `redeemed_${Date.now()}`,
      rewardId: selectedReward.id,
      rewardName: selectedReward.name,
      pointsSpent: selectedReward.pointsCost,
      redeemedDate: new Date().toISOString(),
      status: 'active',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      code: Math.random().toString(36).substr(2, 8).toUpperCase()
    };

    const updatedRewards = {
      ...userRewards,
      points: userRewards.points - selectedReward.pointsCost,
      redeemedRewards: [newRedeemedReward, ...userRewards.redeemedRewards]
    };

    saveUserRewards(updatedRewards);
    setShowRedeemModal(false);
    setSelectedReward(null);
  };

  // Copy referral code
  const copyReferralCode = () => {
    navigator.clipboard.writeText(userRewards.referralCode);
    alert('Referral code copied to clipboard!');
  };

  // Get next tier progress
  const getNextTierProgress = () => {
    const currentTier = tierBenefits[userRewards.tier];
    const nextTier = Object.entries(tierBenefits).find(([key, tier]) => 
      tier.minSpent > userRewards.totalSpent
    );
    
    if (!nextTier) return { progress: 100, nextTier: null };
    
    const [nextTierKey, nextTierData] = nextTier;
    const progress = (userRewards.totalSpent / nextTierData.minSpent) * 100;
    
    return { progress, nextTier: nextTierKey };
  };

  const { progress, nextTier } = getNextTierProgress();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Not signed in.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100/40 to-pink-100/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Rewards & Loyalty</h1>
              <p className="text-gray-600 mt-1">Earn points, unlock rewards, and enjoy exclusive benefits</p>
            </div>
            <Link 
              href="/dashboard" 
              className="px-6 py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:bg-blue-700 transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow mb-8 border border-gray-100">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'rewards', label: 'Rewards', icon: '🎁' },
              { id: 'achievements', label: 'Achievements', icon: '🏆' },
              { id: 'history', label: 'History', icon: '📜' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Points and Tier Card */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">Your Points</h2>
                      <p className="text-purple-100">Keep earning to unlock more rewards!</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">{userRewards.points.toLocaleString()}</div>
                      <div className="text-purple-100">Total Points</div>
                    </div>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Current Tier: {tierBenefits[userRewards.tier].name}</span>
                      <span className="text-sm">{tierBenefits[userRewards.tier].pointsMultiplier}x Points</span>
                    </div>
                    {nextTier && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress to {tierBenefits[nextTier as keyof typeof tierBenefits].name}</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-white/30 rounded-full h-2">
                          <div 
                            className="bg-white h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Total Spent</p>
                        <p className="text-2xl font-bold text-gray-800">₵{userRewards.totalSpent.toLocaleString()}</p>
                      </div>
                      <div className="text-3xl">💰</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Transactions</p>
                        <p className="text-2xl font-bold text-gray-800">{userRewards.totalTransactions}</p>
                      </div>
                      <div className="text-3xl">📊</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Streak Days</p>
                        <p className="text-2xl font-bold text-gray-800">{userRewards.streakDays}</p>
                      </div>
                      <div className="text-3xl">🔥</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Referred Friends</p>
                        <p className="text-2xl font-bold text-gray-800">{userRewards.referredUsers}</p>
                      </div>
                      <div className="text-3xl">👥</div>
                    </div>
                  </div>
                </div>

                {/* Tier Benefits */}
                <div className="bg-white rounded-xl shadow border border-gray-100">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">Tier Benefits</h3>
                    <p className="text-gray-600">Unlock more benefits as you spend more</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {Object.entries(tierBenefits).map(([tierKey, tier]) => (
                        <div key={tierKey} className={`p-4 rounded-lg border-2 ${
                          userRewards.tier === tierKey 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${tier.color} ${tier.bgColor}`}>
                                {tier.name}
                              </span>
                              <span className="text-sm text-gray-600">
                                Min: ₵{tier.minSpent.toLocaleString()}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-gray-600">
                              {tier.pointsMultiplier}x Points
                            </span>
                          </div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {tier.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <span>✓</span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Referral Program */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Refer Friends & Earn</h3>
                      <p className="text-green-100 mb-4">Get 500 points for each friend who joins using your code</p>
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 rounded-lg px-4 py-2">
                          <p className="text-sm text-green-100">Your Code</p>
                          <p className="font-mono font-bold text-lg">{userRewards.referralCode}</p>
                        </div>
                        <button
                          onClick={copyReferralCode}
                          className="px-4 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-all"
                        >
                          Copy Code
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">{userRewards.referredUsers}</div>
                      <div className="text-green-100">Friends Referred</div>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow border border-gray-100">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">Recent Transactions</h3>
                    <p className="text-gray-600">Your latest point-earning activities</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentTransactions.map(transaction => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="text-2xl">💳</div>
                            <div>
                              <p className="font-semibold text-gray-800">{transaction.service}</p>
                              <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">₵{transaction.amount}</p>
                            <p className="text-sm text-green-600">
                              +{transaction.pointsEarned} pts
                              {transaction.bonusPoints && (
                                <span className="text-purple-600"> (+{transaction.bonusPoints} bonus)</span>
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rewards Tab */}
            {activeTab === 'rewards' && (
              <div>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Available Rewards</h2>
                    <p className="text-gray-600">Redeem your points for amazing rewards</p>
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {rewardCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRewards.map(reward => (
                    <div key={reward.id} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        <div className="text-4xl mb-4">{reward.image}</div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{reward.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-purple-600">{reward.pointsCost} pts</span>
                          <button
                            onClick={() => {
                              setSelectedReward(reward);
                              setShowRedeemModal(true);
                            }}
                            disabled={userRewards.points < reward.pointsCost}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              userRewards.points >= reward.pointsCost
                                ? 'bg-purple-600 text-white hover:bg-purple-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {userRewards.points >= reward.pointsCost ? 'Redeem' : 'Insufficient Points'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Achievements</h2>
                  <p className="text-gray-600">Complete challenges to unlock badges and earn bonus points</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userRewards.achievements.map(achievement => (
                    <div key={achievement.id} className={`bg-white rounded-xl shadow border-2 p-6 ${
                      achievement.isUnlocked 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200'
                    }`}>
                      <div className="text-center">
                        <div className={`text-4xl mb-3 ${achievement.isUnlocked ? 'opacity-100' : 'opacity-50'}`}>
                          {achievement.icon}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{achievement.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{achievement.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                achievement.isUnlocked ? 'bg-green-500' : 'bg-purple-500'
                              }`}
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {achievement.isUnlocked && (
                          <div className="mt-3 text-sm text-green-600">
                            ✓ Unlocked {achievement.unlockedDate && 
                              new Date(achievement.unlockedDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Reward History</h2>
                  <p className="text-gray-600">Track your redeemed rewards and point history</p>
                </div>

                {userRewards.redeemedRewards.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-2">🎁</div>
                    <div>No rewards redeemed yet</div>
                    <div className="text-sm">Start earning points and redeem your first reward!</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userRewards.redeemedRewards.map(reward => (
                      <div key={reward.id} className="bg-white rounded-lg shadow border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800">{reward.rewardName}</h3>
                            <p className="text-sm text-gray-600">
                              Redeemed: {new Date(reward.redeemedDate).toLocaleDateString()}
                            </p>
                            {reward.code && (
                              <p className="text-sm text-purple-600 font-mono">Code: {reward.code}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-purple-600 font-semibold">-{reward.pointsSpent} pts</span>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              reward.status === 'active' ? 'bg-green-100 text-green-600' :
                              reward.status === 'used' ? 'bg-gray-100 text-gray-600' :
                              'bg-red-100 text-red-600'
                            }`}>
                              {reward.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Redeem Reward Modal */}
      {showRedeemModal && selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <div className="text-center">
              <div className="text-6xl mb-4">{selectedReward.image}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedReward.name}</h2>
              <p className="text-gray-600 mb-6">{selectedReward.description}</p>
              
              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Your Points:</span>
                  <span className="text-2xl font-bold text-purple-600">{userRewards.points}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-700">Cost:</span>
                  <span className="text-xl font-bold text-gray-800">{selectedReward.pointsCost} pts</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-700">Remaining:</span>
                  <span className="text-lg font-bold text-green-600">
                    {userRewards.points - selectedReward.pointsCost} pts
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={redeemReward}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
                >
                  Confirm Redemption
                </button>
                <button
                  onClick={() => {
                    setShowRedeemModal(false);
                    setSelectedReward(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
