class UserAnswersController < ApiController
  before_action :authenticate, :active_in_group, :pre_wutudu_in_group, :pre_wutudu_not_finished

  def show
    user_answer = @pre_wutudu.user_answers.find_by_user_id(@user.id)
    render errors_msg("User Has Not Answered", 400) and return \
      unless user_answer
    render success_msg({user_answer: user_answer.basic_info}) and return
  end

  def create
    render errors_msg("User Already Answered", 400) and return\
      if @pre_wutudu.user_answers.find_by_user_id(@user.id)
    user_answer = @pre_wutudu.user_answers.build(user_id: @user.id)
    answers = create_user_answer_params[:answers]
    if answers.count(-1) == answers.size
      user_answer.declined = true
    else
      user_answer.answers = answers
    end
    render errors_msg("User Answer Invalid", 400) and return \
      unless user_answer.valid?
    render errors_msg("Failed To Save Answers", 400) and return \
      unless user_answer.save
    render (user_answer.declined? ? success_msg({message: "PreWutudu Declined"}) : \
                                    success_msg({message: "User Answer Saved"})) and return
  end

  private

  def create_user_answer_params
    u = params.require(:user_answer).permit(:answers => [])
    u.require(:answers)
    u
  end

  #TODO: Move these to an abstract prewutudu controller, since they are used in various places
  def active_in_group
    @group = Group.find_by_id(params[:gid])
    render errors_msg("Group Not Found", 404) and return \
      unless @group
    render errors_msg("User Not Active In Group", 400) and return \
      unless @group.active_users.find_by_id(@user.id)
  end

  def pre_wutudu_in_group
    @pre_wutudu = @group.pre_wutudus.find_by_id(params[:pid])
    render errors_msg("PreWutudu Not Found In Group", 404) and return \
      unless @pre_wutudu
  end

  def pre_wutudu_not_finished
    render errors_msg("Action Invalid. PreWutudu Already Finished", 400) and return \
      if @pre_wutudu.finished?
  end
end