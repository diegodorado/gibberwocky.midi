const Examples = {
  default : `/* 
 * BEFORE DOING ANYTHING, MAKE SURE YOU CHOOSE
 * A MIDI OUTPUT IN THE MIDI TAB. THEN, SELECT A MIDI INPUT TO ACCEPT
 * MIDI CLOCK SYNC FROM YOUR DAW. These MIDI settings will be remembered
 * from one gibberwocky.midi session to the next. For more information see 
 */

/* 
 * NEXT STEP (AND THIS IS JUST AS IMPORTANT) YOU MUST START
 * THE TRANSPORT IN YOUR DAW. IF THE TRANSPORT WAS ALREADY RUNNING
 * WHEN YOU LOADED THIS PAGE, STOP IT, AND THEN START IT AGAIN.
 * This will create an initial sync signal between you DAW and this page.
 * After this initial stopping / starting you should be able to start and
 * stop the transport at will in your DAW and maintain sync in gibberwocky.midi.
 */

// OK, put some type of melodic instrument on a track in your DAW, and set that
// track to receive messages from the MIDI output you selected for gibberwocky.

// And now we're ready to start :)

// Pick a MIDI channel to target. subsitute another number for 0 as needed
// To run the line of code below, place your cursor on the line and hit Ctrl+Enter.
channel = channels[0]

// play a note identified by name
channel.note( 'c4' ) // ... or d4, fb2, e#5 etc.

// play a note identified by number. The number represents a
// position in gibberwocky's master scale object. By default the master
// scale is set to a root of C4 and the aeolian mode.
channel.note( 0 )

// Change master scale root
Scale.master.root( 'e4' )
channel.note( 0 )

// You can also send raw midi note messages without using
// gibberwocky.midi's internal scale with calls to midinote instead
// of note.
channel.midinote( 64 )

// You can change velocity...
channel.velocity( 20 )
channel.midinote( 64 )

channel.velocity( 100 )
channel.midinote( 64 )

// ... and you can set duration in milliseconds
channel.duration( 2000 )
channel.midinote( 64 )
channel.duration( 50 )
channel.midinote( 64 )

// sequence calls to the note method every 1/16 note. An optional
// third argument assigns an id# to the sequencer; by
// default this id is set to 0 if no argument is passed.
// Assigning sequences to different id numbers allows them
// to run in parallel.
channel.note.seq( [0,1,2,3,4,5,6,7], 1/8 )

// sequence velocity to use random values between 10-127 (midi range)
channel.velocity.seq( Rndi( 10,127), 1/16 )

// sequence duration of notes in milliseconds
channel.duration.seq( [ 50, 250, 500 ].rnd(), 1/16 )

// sequence the master scale to change root every measure
Scale.root.seq( ['c4','d4','f4','g4'], 1 )

// sequence the master scale to change mode every measure
Scale.mode.seq( ['aeolian','lydian', 'wholeHalf'], 1 )

// stop the sequence with id# 0 from running
channel.note[ 0 ].stop()

// stop scale sequencing
Scale.mode[ 0 ].stop()
Scale.root[ 0 ].stop()

// set scale mode
Scale.mode( 'Lydian' )
Scale.root( 'c3' )

// Create an arpegctor by passing notes of a chord, 
// number of octaves to play, and style. Possible styles 
// include 'up', 'down', 'updown' (repeat top and bottom 
// notes) and 'updown2'
a = Arp( [0,2,3,5], 4, 'updown2' )

// create sequencer using arpeggiator and 1/16 notes
channel.note.seq( a, 1/16 )

// transpose the notes in our arpeggio by one scale degree
a.transpose( 1 )

// sequence transposition of one scale degree every measure
a.transpose.seq( 1,1 )

// reset the arpeggiator every 8 measures 
// (removes transposition)
a.reset.seq( 1, 8 )

// stop sequence
channel.note[ 0 ].stop()

// creates sequencer at this.note[1] (0 is default)
channel.note.seq( [0,1,2,3], [1/4,1/8], 1 )

// parallel sequence at this.note[2] with 
// random note selection  (2 is last arg)
channel.note.seq( [5,6,7,8].rnd(), 1/4, 2 )

// Every sequence contains two Pattern functions. 
// The first, 'values',determines the output of the 
// sequencer. The second, 'timings', determines when the 
// sequencer fires.

// sequence transposition of this.note[2]
channel.note[ 2 ].values.transpose.seq( [1,2,3,-6], 1 )

// stop this.note[1]
channel.note[ 1 ].stop()

// start this.note[0]
channel.note[ 1 ].start()`,

['modulating with genish.js'] : `/* gen~ is an extension for Max for Live for synthesizing audio/video signals.
In gibberwocky.midi, we can use a JavaScript port of gen~, genish.js to create complex modulation graphs outputting
CC messages. LFOs, ramps, stochastic signals... genish can create a wide variety of modulation sources for
exploration.

As we saw in the paramter sequencing tutorial (look at that now if you haven't yet, or you'll be a
bit lost here), most ugens from genish.js are available for scripting in gibberwocky.
Perhaps the most basic modulation is a simple ramp. In your target application / MIDI hardware device setup
a synthesis parameter to be controlled by CC0. To send a repeating ramp to signal to CC0 on channel 0 we
would use:*/

channels[0].cc0( phasor( 1 ) )

This ramp repeats regularly at 1 Hz. All graphs in genish.js typically output to a range of {-1,1} (or sometimes {0,1}),
however, for MIDI we want to ensure that we have an output signal in the range of {0,127}. Thus, by default, the {-1,1}
signal will automatically be transformed to {0,127}. You can turn this off by passing a value of false as the second
paramter to the CC function. The example below is designed to automatically travel between 32 and 96, so we pass false
to ensure that no additional transformation is applied:*/

channels[0].cc0( 
  add( 
    32, 
    mul(  
      64, 
      phasor( 1 ) 
    ) 
  ), 
  false 
)

/* Another common ugen used for modulation is the sine oscillator; in
gen~ this is the cycle() ugen. The cycle() accepts one parameter, the frequency that it operates at.
So we can do the following:*/

channels[0].cc0( cycle( .5 ) )

/* Often times we want to specify a center point (bias) for our sine oscillator, in addition to 
a specific amplitude and frequency. The lfo() function provides a simpler syntax for doing this:*/

// frequency, amplitude, bias
channel[0].cc0( lfo( 2, .1, .7 ) )

// We can also easily sequence parameters of our LFO XXX CURRENTLY BROKEN:

mylfo.frequency.seq( [ .5,1,2,4 ], 2 )

/* ... as well as sequence any other parameter in Live controlled by a genish.js graph. Although the lfo()
ugen provides named properties for controlling frequency, amplitude, and centroid, there is a more
generic way to sequence any aspect of a gen~ ugen by using the index operator ( [] ). For example,
cycle() contains a single inlet that controls its frequency, to sequence it we would use: */

mycycle = cycle( .25 )

mycycle[ 0 ].seq( [ .25, 1, 2 ], 1 )

channels[0].cc0( add( .5, div( mycycle, 2 ) ) )

/*For other ugens that have more than one argument (see the genish.js random tutorial for an example) we
simply indicate the appropriate index... for example, mysah[ 1 ] etc.*/`,

[ 'using the Score() object' ]  : `// Scores are lists of functions with associated
// relative time values. In the score below, the first function has
// a time value of 0, which means it begins playing immediately. The
// second has a value of 1, which means it beings playing one measure
// after the previously executed function. The last function has a
// timestamp of two, which means it begins playing two measures after
// the previously executed function. Scores have start(), stop(),
// loop(), pause() and rewind() methods.

s = Score([ 
  0, function() { 
    channels[1].note.seq( 0, 1/4 )
  },
  1, function() { 
     channels[1].note.seq( [0,1], Euclid(3,4), 1 )
  },
  2, function() { 
    channels[1].note.seq( [7,14,13,8].rnd(), [1/4,1/8].rnd(), 2 )
  },  
])

s.stop()

// scores become much terser using the arrow functions recently added to JS

s = Score([
  0, ()=> channels[1].note.seq( [0,1,2,3], 1/4 ),
  1, ()=> channels[1].note.seq( [0,1], Euclid(2,4), 1 ),
  1, ()=> channels[1].note.seq( [3,4], [1/4,1/8], 2 )
])`,

['using the Steps() object (step-sequencer)'] : `/* Steps() creates a group of sequencer objects. Each
 * sequencer is responsible for playing a single note,
 * where the velocity of each note is determined by
 * a hexadecimal value (0-f), where f is the loudest note.
 * A value of '.' means that no MIDI note message is sent
 * with for that particular pattern element.
 *
 * The lengths of the patterns found in a Steps object can
 * differ. By default, the amount of time for each step in
 * a pattern equals 1 divided by the number of steps in the
 * pattern. In the example below, most patterns have sixteen
 * steps, so each step represents a sixteenth note. However,
 * the first two patterns (60 and 62) only have four steps, so
 * each is a quarter note. 
 *
 * The individual patterns can be accessed using the note
 * numbers they are assigned to. So, given an instance with
 * the name 'a' (as below), the pattern for note 60 can be
 * accessed at a[60]. Note that you have to access with brackets
 * as a.60 is not valid JavaScript.
 *
 * The second argument to Steps is the channel to target.  
 */ 

a = Steps({
  [60]: 'ffff',
  [62]: '.a.a',
  [64]: '........7.9.c..d',
  [65]: '..6..78..b......',
  [67]: '..c.f....f..f..3',  
  [71]: '.e.a.a...e.a.e.a',  
  [72]: '..............e.',
}, Gibber.MIDI.channels[0] )

// rotate one pattern in step sequencer
// every measure
a[71].rotate.seq( 1,1 )

// reverse all steps each measure
a.reverse.seq( 1, 2 )`,

}

module.exports = Examples//stepsExample2//simpleExample//genExample//exampleScore4//exampleScore4 //'this.note.seq( [0,1], Euclid(5,8) );' //exampleCode
