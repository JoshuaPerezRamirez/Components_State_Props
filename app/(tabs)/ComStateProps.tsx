import React, { useState, useRef } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions,} from 'react-native';

type HoldDirection = 'up' | 'down';

interface CounterCardProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
  onHoldStart: (direction: HoldDirection) => void;
  onHoldEnd: () => void;
}

const PixelBlock: React.FC<{ color: string; shadow?: boolean }> = ({
  color,
  shadow,
}) => (
  <View
    style={[
      styles.pixelBlock,
      { backgroundColor: color },
      shadow && styles.pixelBlockShadow,
    ]}
  />
);

const GrassStrip: React.FC = () => {
  const grassColors = ['#6EC93F', '#5AB52E', '#7BD64A', '#4F9E27'];
  const blocks = Array.from({ length: 16 });
  return (
    <View style={styles.grassStripRow}>
      {blocks.map((_, i) => (
        <PixelBlock
          key={`grass-${i}`}
          color={grassColors[i % grassColors.length]}
          shadow={i % 3 === 0}
        />
      ))}
    </View>
  );
};

const DirtStrip: React.FC = () => {
  const dirtColors = ['#8B5A2B', '#7A4A1F', '#9C6B36', '#6E4420'];
  const blocks = Array.from({ length: 16 });
  return (
    <View style={styles.dirtStripRow}>
      {blocks.map((_, i) => (
        <PixelBlock
          key={`dirt-${i}`}
          color={dirtColors[i % dirtColors.length]}
          shadow={i % 4 === 1}
        />
      ))}
    </View>
  );
};

const CounterCard: React.FC<CounterCardProps> = ({
  value,
  onIncrement,
  onDecrement,
  onReset,
  onHoldStart,
  onHoldEnd,
}) => {
  return (
    <View style={styles.childCard}>
      <View style={styles.childTag}>
        <Text style={styles.childTagText}>CHILD COMPONENT</Text>
      </View>

      <View style={styles.displayRow}>
        <View style={styles.numberWrap}>
          <Text style={styles.numberLabel}>VALUE</Text>
          <Text style={styles.numberText}>{value}</Text>
        </View>
      </View>

      <View style={styles.padRow}>
        <TouchableOpacity
          style={[
            styles.padButton,
            styles.decrementButton,
            value <= 0 && styles.padButtonDisabled,
          ]}
          activeOpacity={0.85}
          disabled={value <= 0}
          onPress={onDecrement}
          onLongPress={() => onHoldStart('down')}
          onPressOut={onHoldEnd}
          delayLongPress={300}
        >
          <Text style={styles.padIcon}>−</Text>
          <Text style={styles.padLabel}>MINUS COUNT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.padButton, styles.incrementButton]}
          activeOpacity={0.85}
          onPress={onIncrement}
          onLongPress={() => onHoldStart('up')}
          onPressOut={onHoldEnd}
          delayLongPress={300}
        >
          <Text style={styles.padIcon}>＋</Text>
          <Text style={styles.padLabel}>ADD COUNT</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.resetButton}
        activeOpacity={0.85}
        onPress={onReset}
      >
        <Text style={styles.resetIcon}>↺</Text>
        <Text style={styles.resetLabel}>RESET COUNT</Text>
      </TouchableOpacity>

      <Text style={styles.holdHint}>THANK YOU SIR JASON!</Text>
    </View>
  );
};

const BASE_VALUE = 100;
const HOLD_INTERVAL_MS = 90;
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ComStateProps: React.FC = () => {
  const [value, setValue] = useState<number>(BASE_VALUE);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearHold = () => {
    if (holdTimer.current) {
      clearInterval(holdTimer.current);
      holdTimer.current = null;
    }
  };

  const increment = () => setValue((prev) => prev + 1);
  const decrement = () => setValue((prev) => Math.max(0, prev - 1));

  const reset = () => {
    clearHold();
    setValue(BASE_VALUE);
  };

  const startHold = (direction: HoldDirection) => {
    clearHold();
    holdTimer.current = setInterval(() => {
      setValue((prev) => {
        if (direction === 'up') return prev + 1;
        const next = prev - 1;
        if (next <= 0) {
          clearHold();
          return 0;
        }
        return next;
      });
    }, HOLD_INTERVAL_MS);
  };

  const endHold = () => clearHold();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.screen, { minHeight: SCREEN_HEIGHT }]}>
        <View style={styles.parentCard}>
          <GrassStrip />

          <View style={styles.parentBody}>
            <View style={styles.parentTag}>
              <Text style={styles.parentTagText}>PARENT COMPONENT</Text>
            </View>

            <Text style={styles.screenTitle}>JOSHUA P. RAMIREZ</Text>
            <Text style={styles.screenSubtitle}>
              COMPONENTS{'  '}•{'  '}PROPERTIES{'  '}•{'  '}STATE
            </Text>

            <View style={styles.statePanel}>
              <Text style={styles.statePanelLabel}>CURRENT STATE</Text>
              <Text style={styles.statePanelValue}>{value}</Text>
              <View style={styles.statePanelBarTrack}>
                <View
                  style={[
                    styles.statePanelBarFill,
                    {
                      width: `${Math.max(
                        4,
                        Math.min(100, (value / (BASE_VALUE * 4)) * 100)
                      )}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <CounterCard
              value={value}
              onIncrement={increment}
              onDecrement={decrement}
              onReset={reset}
              onHoldStart={startHold}
              onHoldEnd={endHold}
            />
          </View>

          <DirtStrip />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ComStateProps;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1B1B1B',
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  pixelBlock: {
    flex: 1,
    height: 12,
  },
  pixelBlockShadow: {
    opacity: 0.65,
  },
  grassStripRow: {
    flexDirection: 'row',
    width: '100%',
  },
  dirtStripRow: {
    flexDirection: 'row',
    width: '100%',
  },

  parentCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#3B3B3B',
    borderWidth: 4,
    borderColor: '#1B1B1B',
    overflow: 'hidden',
  },
  parentBody: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  parentTag: {
    alignSelf: 'center',
    backgroundColor: '#8B5A2B',
    borderWidth: 3,
    borderColor: '#4A2E12',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
  },
  parentTagText: {
    color: '#FFE08A',
    fontWeight: '900',
    fontSize: 9,
    letterSpacing: 1,
    textAlign: 'center',
  },
  screenTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  screenSubtitle: {
    color: '#A7E08A',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 12,
    textAlign: 'center',
  },

  statePanel: {
    backgroundColor: '#1B1B1B',
    borderWidth: 3,
    borderColor: '#6EC93F',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  statePanelLabel: {
    color: '#6EC93F',
    fontWeight: '900',
    fontSize: 9,
    letterSpacing: 1.4,
    marginBottom: 4,
    textAlign: 'center',
  },
  statePanelValue: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 26,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  statePanelBarTrack: {
    height: 10,
    width: '100%',
    backgroundColor: '#4A2E12',
    borderWidth: 2,
    borderColor: '#1B1B1B',
    overflow: 'hidden',
  },
  statePanelBarFill: {
    height: '100%',
    backgroundColor: '#6EC93F',
  },

  childCard: {
    backgroundColor: '#5A4632',
    borderWidth: 3,
    borderColor: '#1B1B1B',
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 14,
    width: '100%',
    alignItems: 'center',
  },
  childTag: {
    alignSelf: 'center',
    backgroundColor: '#1B1B1B',
    borderWidth: 3,
    borderColor: '#6EC93F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  childTagText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 9,
    letterSpacing: 1,
    textAlign: 'center',
  },

  displayRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 14,
  },

  numberWrap: {
    width: '100%',
    backgroundColor: '#1B1B1B',
    borderWidth: 4,
    borderColor: '#8B5A2B',
    paddingVertical: 16,
    alignItems: 'center',
  },
  numberLabel: {
    color: '#FFE08A',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 4,
    textAlign: 'center',
  },
  numberText: {
    color: '#6EC93F',
    fontWeight: '900',
    fontSize: 48,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },

  padRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  padButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderWidth: 3,
  },
  incrementButton: {
    backgroundColor: '#6EC93F',
    borderColor: '#2E5E14',
    marginLeft: 6,
  },
  decrementButton: {
    backgroundColor: '#C0392B',
    borderColor: '#6E1A10',
    marginRight: 6,
  },
  padButtonDisabled: {
    opacity: 0.4,
  },
  padIcon: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 28,
    marginBottom: 2,
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  padLabel: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 10.5,
    letterSpacing: 0.6,
    textAlign: 'center',
  },

  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#7A7A7A',
    borderWidth: 3,
    borderColor: '#3D3D3D',
    paddingVertical: 13,
  },
  resetIcon: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
    marginRight: 8,
    textAlign: 'center',
  },
  resetLabel: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11.5,
    letterSpacing: 1,
    textAlign: 'center',
  },

  holdHint: {
    color: '#C9C9C9',
    fontSize: 9.5,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
  },
});