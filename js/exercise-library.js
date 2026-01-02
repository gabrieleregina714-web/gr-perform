// GR Perform - Curated Exercise Library (v1)
// Goal: provide a large-but-controlled pool of proven exercises + templates (e.g., boxing circuits)
// that the AI can reference deterministically.
//
// Shape returned by GR_getExerciseLibrary(sport, focusKey):
// {
//   warmup: string[], lowerStrength: string[], upperStrength: string[], accessory: string[], conditioning: string[]
// }

(function () {
  const LIB = {
    version: 1,
    notes: 'Curated, expandable library. Add only exercises you actually use with clients.',
    sports: {
      common: {
        warmup: [
          'Hip mobility flow (5-7 min)',
          'Ankle mobility + calf activation',
          'Thoracic rotation + breathing',
          'Glute med activation (band walks)',
          'Dynamic hamstring prep',
          '90/90 hip switches',
          'Cat-camel + T-spine opener'
        ],
        lowerStrength: [
          'Trap Bar Deadlift',
          'Front Squat',
          'Goblet Squat',
          'Romanian Deadlift',
          'Bulgarian Split Squat',
          'Hip Thrust',
          'Step-Up (knee drive)',
          'Rear-Foot Elevated Split Squat (RFESS)',
          'Single-Leg RDL (DB)',
          'Sled Push (heavy)'
        ],
        upperStrength: [
          'Bench Press',
          'Incline Dumbbell Press',
          'Landmine Press',
          'Push-Up (weighted if needed)',
          'Pull-ups (assisted if needed)',
          'Lat Pulldown',
          'Chest-Supported Row',
          '1-Arm Cable Row',
          'Seated Row',
          'Face Pull'
        ],
        accessory: [
          'Nordic Hamstring (eccentric)',
          'Copenhagen plank',
          'Calf Raises (straight knee)',
          'Soleus Raises (bent knee)',
          'Pallof Press',
          'Dead Bug',
          'Side Plank',
          'Farmer Carry',
          'Scapular control (Y-T-W)',
          'External rotation (cable/band)'
        ],
        conditioning: [
          'Assault Bike Intervals',
          'Row Erg Intervals',
          'Sled Pushes (medium)',
          'Tempo Run (easy)',
          'Shuttle Runs (COD)',
          'Med Ball Slams (power intervals)',
          'Jump Rope Intervals'
        ]
      },

      boxe: {
        // Boxing-specific: circuits are common and should be used intentionally.
        conditioning: [
          // Circuit templates (encoded as a single "exercise" entry)
          'Circuit: 6 stazioni x 40" ON / 20" OFF x 3 giri (RPE 7) | 1) Jump Rope 2) Med Ball Slams 3) Push-Up 4) Row (band/cable) 5) Split Squat 6) Shadowboxing high pace',
          'Circuit: EMOM 12\' (tecnico-condizionante) | Min pari: 45" shadowboxing (focus footwork) | Min dispari: 10 burpee step-back + 20" plank',
          'Circuit: 5 stazioni x 45"/15" x 4 giri | 1) Jump Rope 2) Battle Rope 3) Med Ball Rotational Throw 4) Bike sprint 5) Core (dead bug / hollow)',
          'Intervals: Jump Rope 10x(45" on / 15" off)',
          'Intervals: Assault Bike 8x(30" hard / 90" easy)',
          'Shadowboxing conditioning: 6x2\' (30" easy / 30" hard)'
        ],
        accessory: [
          'Rotational med ball throws',
          'Anti-rotation press (Pallof)',
          'Scapular control (Y-T-W)',
          'Neck isometrics (safe positions)',
          'Single-leg balance + reach'
        ]
      },

      calcio: {
        accessory: [
          'Adductor strength (side plank adduction)',
          'Single-leg balance + reach',
          'Hamstring sliders (eccentric)',
          'Groin prehab (Copenhagen regressions)'
        ],
        conditioning: [
          'Acceleration mechanics drills',
          'Sled Pushes (acceleration)',
          'Shuttle runs 5-10-5 (COD)',
          'Tempo run 12-20\' (easy)',
          'Bike intervals 10x(20" hard / 40" easy)'
        ]
      },

      basket: {
        accessory: [
          'Single-leg landing mechanics (low impact)',
          'Calf/Achilles capacity (bent + straight knee)',
          'Hip stability (band walks + single leg)',
          'Core anti-rotation (Pallof)'
        ],
        conditioning: [
          'Shuttle runs (COD)',
          'Row erg intervals',
          'Bike intervals',
          'Court suicides (dose carefully)'
        ]
      },

      palestra: {
        hypertrophy: {
          lowerStrength: [
            'Back Squat',
            'Leg Press',
            'Hack Squat',
            'Walking Lunges',
            'Romanian Deadlift',
            'Leg Curl',
            'Leg Extension'
          ],
          upperStrength: [
            'Incline Dumbbell Press',
            'Cable Fly',
            'Lat Pulldown',
            'Seated Row',
            'Dumbbell Shoulder Press',
            'Lateral Raise',
            'Triceps Pressdown',
            'DB Curl'
          ],
          accessory: [
            'Rear delt (cable)',
            'Face pull',
            'Calf raises',
            'Core: dead bug / plank',
            'Back extension (controlled)'
          ],
          conditioning: [
            'Incline treadmill walk (steady)',
            'Bike intervals (low impact)',
            'Row erg easy'
          ]
        }
      }
    }
  };

  const merge = (base, extra) => {
    const out = { ...base };
    const keys = ['warmup', 'lowerStrength', 'upperStrength', 'accessory', 'conditioning'];
    for (const k of keys) {
      const a = Array.isArray(base?.[k]) ? base[k] : [];
      const b = Array.isArray(extra?.[k]) ? extra[k] : [];
      out[k] = [...a, ...b];
    }
    return out;
  };

  function GR_getExerciseLibrary(sport, focusKey) {
    const s = String(sport || '').toLowerCase();
    const focus = String(focusKey || '').toLowerCase();

    const common = LIB.sports.common;

    if (s === 'boxe') {
      return merge(common, LIB.sports.boxe);
    }

    if (s === 'calcio') {
      return merge(common, LIB.sports.calcio);
    }

    if (s === 'basket') {
      return merge(common, LIB.sports.basket);
    }

    if (s === 'palestra') {
      if (focus === 'hypertrophy') {
        const h = LIB.sports.palestra.hypertrophy;
        return {
          warmup: common.warmup,
          lowerStrength: h.lowerStrength,
          upperStrength: h.upperStrength,
          accessory: h.accessory,
          conditioning: h.conditioning
        };
      }
      return common;
    }

    return common;
  }

  window.GR_EXERCISE_LIBRARY = LIB;
  window.GR_getExerciseLibrary = GR_getExerciseLibrary;
})();
