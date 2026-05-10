import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '../constants/tokens';

function fmtJPY(n: number): string {
  return '¥' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

interface Props {
  amounts:  number[];
  selected: number;
  onSelect: (amount: number) => void;
}

export default function AmountPicker({ amounts, selected, onSelect }: Props) {
  return (
    <View style={styles.grid}>
      {amounts.map((amount) => {
        const active = selected === amount;
        return (
          <TouchableOpacity
            key={amount}
            style={[styles.btn, active && styles.btnActive]}
            onPress={() => onSelect(amount)}
          >
            <Text style={[styles.text, active && styles.textActive]}>
              {fmtJPY(amount)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  btn:        { flex: 1, minWidth: '40%', padding: 16, borderWidth: 1, borderColor: colors.line, borderRadius: radii.button, backgroundColor: colors.ink2, alignItems: 'center' },
  btnActive:  { borderColor: colors.vermilion, backgroundColor: 'rgba(255,77,46,0.08)' },
  text:       { fontFamily: fonts.jpDisplay, fontSize: 18, color: colors.textMuted, fontWeight: '700' },
  textActive: { color: colors.vermilion },
});
