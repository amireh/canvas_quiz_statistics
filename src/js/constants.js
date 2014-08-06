define(function() {
  return {
    DISCRIMINATION_INDEX_THRESHOLD: 0.25,

    // a whitelist of the attributes we need from the payload
    QUIZ_STATISTICS_ATTRS: [
      'id',
      'points_possible',
      'speed_grader_url',
      'quiz_submissions_zip_url',
    ],

    SUBMISSION_STATISTICS_ATTRS: [
      'score_average',
      'score_high',
      'score_low',
      'score_stdev',
      'scores',
      'duration_average',
      'unique_count',
    ],

    QUESTION_STATISTICS_ATTRS: [
      'id',
      'question_type',
      'question_text',
      'responses',
      'answers',
      'answered_student_count',

      'top_student_count',
      'middle_student_count',
      'bottom_student_count',
      'correct_top_student_count',
      'correct_middle_student_count',
      'correct_bottom_student_count',
      'point_biserials'
    ],
  };
});