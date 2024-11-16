import { getCompletion } from "../services/openaiService.js";

const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const response = await getCompletion(message);

    res.json({
      success: true,
      data: {
        message: response,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        history: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

export { sendMessage, getHistory };
