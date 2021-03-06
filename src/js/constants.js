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

    POINT_BISERIAL_ATTRS: [
      'answer_id',
      'correct',
      'distractor',
      'point_biserial',
    ],

    QUIZ_REPORT_ATTRS: [
      'id',
      'report_type',
      'readable_type',
      'generatable'
    ],

    PROGRESS_ATTRS: [
      'id',
      'completion',
      'url', // for polling
      'workflow_state'
    ],

    ATTACHMENT_ATTRS: [
      'url'
    ],

    DISCRIMINATION_INDEX_HELP_ARTICLE_URL: "http://guides.instructure.com/m/4152/l/41484-once-i-publish-my-quiz-what-kinds-of-quiz-statistics-are-available"
  };
});