import numpy as np


RGB_TO_LUMINANCE = np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
EPSILON = 1e-6


def linear_to_srgb(image, gamma=2.2):
    image = np.clip(image, 0.0, 1.0)
    return np.power(image, 1.0 / gamma)


def compute_luminance(rgb):
    return np.dot(rgb[..., :3], RGB_TO_LUMINANCE)


def simple_preview(rgb, gamma=2.2):
    """Create a quick display preview from an HDR image without a real TMO."""
    image = np.maximum(rgb, 0.0)
    scale = np.percentile(image, 99.0)
    if scale <= EPSILON:
        scale = image.max() if image.max() > EPSILON else 1.0
    return linear_to_srgb(image / scale, gamma=gamma)


def reinhard_global(rgb, key=0.18, gamma=2.2, white_point=None):
    """
    Global Reinhard tone mapping operator.

    Reference formula:
    L_m = key / exp(mean(log(delta + L_w))) * L_w
    L_d = L_m / (1 + L_m)

    If white_point is provided:
    L_d = L_m * (1 + L_m / white_point^2) / (1 + L_m)
    """
    image = np.maximum(rgb.astype(np.float32), 0.0)
    luminance = compute_luminance(image)
    log_average = np.exp(np.mean(np.log(EPSILON + luminance)))

    mapped_luminance = (key / (log_average + EPSILON)) * luminance
    if white_point is not None and white_point > EPSILON:
        display_luminance = (
            mapped_luminance * (1.0 + mapped_luminance / (white_point * white_point))
        ) / (1.0 + mapped_luminance)
    else:
        display_luminance = mapped_luminance / (1.0 + mapped_luminance)

    scale = display_luminance / (luminance + EPSILON)
    mapped_rgb = image * scale[..., np.newaxis]
    return linear_to_srgb(mapped_rgb, gamma=gamma)
