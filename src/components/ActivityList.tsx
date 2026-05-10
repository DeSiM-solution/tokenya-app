import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '../constants/tokens';
import { formatJPY, formatDate } from '../utils/format';

export interface Activity {
  id: number;
  model: string;
  tokens: number;
  costJPY: number;
  createdAt: number;
}

export default function ActivityList({ items }: { items: Activity[] }) {
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <View key={item.id} style={styles.item}>
          <View>
            <Text style={styles.model}>{item.model}</Text>
            <Text style={styles.meta}>
              {item.tokens.toLocaleString('ja-JP')} tokens · {formatDate(item.createdAt)}
            </Text>
          </View>
          <Text style={styles.cost}>{formatJPY(item.costJPY)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list:  { borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, backgroundColor: colors.ink2 },
  item:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  model: { fontFamily: fonts.mono, fontSize: 14, color: colors.text, fontStyle: 'italic' },
  meta:  { fontFamily: fonts.mono, fontSize: 10, color: colors.textDim, marginTop: 2, letterSpacing: 0.5 },
  cost:  { fontFamily: fonts.mono, fontSize: 13, color: colors.vermilion, fontWeight: '500' },
});
