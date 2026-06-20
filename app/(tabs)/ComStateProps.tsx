import React, { useState, useRef } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions,} from 'react-native';

// CHILD COMPONENT (CounterCard)
// Dumb component lang ito - walang sariling state.
// Lahat ng makikita dito ay galing sa PROPS ng Parent:
// yung value ay DATA pababa (parent state - child)
// yung onIncrement - FUNCTION pataas (child - parent state)
// then ang onDecrement - FUNCTION pataas (child - parent state)
// itonng onReset - FUNCTION pataas (child - parent state)
// itong onHoldStart/onHoldEnd - para sa tuloy-tuloy na ang bilang pataas o pababa habang naka-hold ang button

type HoldDirection = 'up' | 'down';

interface CounterCardProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
  onHoldStart: (direction: HoldDirection) => void;
  onHoldEnd: () => void;
}

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
        <Text style={styles.childTagText}>CHILD COMPONENT </Text>
      </View>

      <View style={styles.displayRow}>
        {/* Kiosk-style na malaking number display, para kita ko na agad siya */}
        <View style={styles.numberWrap}>
          <Text style={styles.numberLabel}>VALUE</Text>
          <Text style={styles.numberText}>{value}</Text>
        </View>
      </View>

      {/* Yung Increment / Decrement side-by-side, like kiosk control pad lang ganern */}
      <View style={styles.padRow}>
        <TouchableOpacity
          style={[styles.padButton, styles.decrementButton]}
          activeOpacity={0.85}
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

      <Text style={styles.holdHint}> THANK YOU SIR JASON! </Text>
    </View>
  );
};

// Ang child ay hindi nagbabago ng state diretso - tumatawag
// lang ito ng function na pinasa bilang props, at ang parent

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
  const decrement = () => setValue((prev) => prev - 1);

  const reset = () => {
    clearHold();
    setValue(BASE_VALUE);
  };

  // tinatawag ito kapag long press - para tuloy tuloy ang pag-increment o pag-decrement habang naka-hold
  const startHold = (direction: HoldDirection) => {
    clearHold();
    holdTimer.current = setInterval(() => {
      setValue((prev) => (direction === 'up' ? prev + 1 : prev - 1));
    }, HOLD_INTERVAL_MS);
  };

  // Bali ito ay ang tinatawag pag binitawan na ang daliri sa button
  const endHold = () => clearHold();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.screen, { minHeight: SCREEN_HEIGHT }]}>
        <View style={styles.parentCard}>
          <View style={styles.parentTag}>
            <Text style={styles.parentTagText}>PARENT COMPONENT</Text>
          </View>

          <Text style={styles.screenTitle}> JOSHUA P. RAMIREZ </Text>
          <Text style={styles.screenSubtitle}>
            COMPONENTS | PROPERTIES | STATE 
          </Text>

          {/* STATE PANEL - ipinapakita ang live value ng state sa parent */}
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

          {/* CHILD COMPONENT - props pababa, function calls pataas */}
          <CounterCard
            value={value}
            onIncrement={increment}
            onDecrement={decrement}
            onReset={reset}
            onHoldStart={startHold}
            onHoldEnd={endHold}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ComStateProps;

// STYLESHEET na ginamit ko para sa buong screen, pati na rin sa parent at child components

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0E1A',
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  // PARENT CARD ITO (like kiosk frame)
  parentCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#11142B',
    borderWidth: 2,
    borderColor: '#2A2F66',
    borderRadius: 24,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  parentTag: {
    alignSelf: 'center',
    backgroundColor: '#FF7A45',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 8,
  },
  parentTagText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
    textAlign: 'center',
  },
  screenTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 2,
    textAlign: 'center',
  },
  screenSubtitle: {
    color: '#7C82B8',
    fontSize: 11,
    marginBottom: 14,
    textAlign: 'center',
  },

  statePanel: {
    backgroundColor: '#0B0E1A',
    borderWidth: 2,
    borderColor: '#1ED9A4',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
    width: '100%',
    alignItems: 'center',
  },
  statePanelLabel: {
    color: '#1ED9A4',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1.4,
    marginBottom: 2,
    textAlign: 'center',
  },
  statePanelValue: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 26,
    marginBottom: 8,
    textAlign: 'center',
  },
  statePanelBarTrack: {
    height: 6,
    width: '100%',
    borderRadius: 3,
    backgroundColor: '#15234E',
    overflow: 'hidden',
  },
  statePanelBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1ED9A4',
  },

  // ---------- CHILD CARD (kiosk control panel) ----------
  childCard: {
    backgroundColor: '#171B3D',
    borderWidth: 2,
    borderColor: '#3D5BFF',
    borderRadius: 20,
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
  },
  childTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#3D5BFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
  },
  childTagText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.6,
    textAlign: 'center',
  },

  displayRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },

  // ---------- NUMBER DISPLAY (digital readout look) ----------
  numberWrap: {
    width: '100%',
    backgroundColor: '#05060F',
    borderWidth: 2,
    borderColor: '#3D5BFF',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  numberLabel: {
    color: '#5C6BFF',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 4,
    textAlign: 'center',
  },
  numberText: {
    color: '#5CE1E6',
    fontWeight: '900',
    fontSize: 54,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },

  padRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  padButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 20,
    borderWidth: 2,
  },
  incrementButton: {
    backgroundColor: '#3D8BFF',
    borderColor: '#1A5FC4',
    marginLeft: 7,
  },
  decrementButton: {
    backgroundColor: '#FF4D8D',
    borderColor: '#C2155F',
    marginRight: 7,
  },
  padIcon: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 30,
    marginBottom: 2,
    textAlign: 'center',
  },
  padLabel: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
    textAlign: 'center',
  },

  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#262B57',
    borderWidth: 2,
    borderColor: '#454C9C',
    borderRadius: 14,
    paddingVertical: 13,
  },
  resetIcon: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    marginRight: 8,
    textAlign: 'center',
  },
  resetLabel: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
    textAlign: 'center',
  },

  holdHint: {
    color: '#5C6299',
    fontSize: 10.5,
    textAlign: 'center',
    marginTop: 10,
  },
});