(() => {
  "use strict";

  const STORAGE_KEY = "advanced-generative-models-study-state-v1";
  const SUMMARY_ID = "__summary__";

  const quiz = (title, body, options, successMessage) => ({
    title,
    body,
    options: options.map(([id, label, correct, feedback]) => ({ id, label, correct, feedback })),
    successMessage,
  });

  const slide = (folder, number, title, eyebrow, overview, pointers, options = {}) => ({
    id: `${folder.toLowerCase()}-${String(number).padStart(2, "0")}`,
    kind: "slide",
    sourceNumber: number,
    title,
    eyebrow,
    overview,
    pointers,
    media: `slides/${folder}/${options.filename || `${number}.png`}`,
    alt: options.alt || `${title}. Course slide ${number}.`,
    transitionMedia: options.transition ? `media/${folder}/${options.transition}` : undefined,
    transitionAlt: options.transitionAlt,
    quiz: options.quiz,
  });

  const practice = (folder, number, title, overview, pointers, activity, options = {}) => ({
    id: `${folder.toLowerCase()}-${String(number).padStart(2, "0")}`,
    kind: "pseudocode",
    sourceNumber: number,
    eyebrow: "Coding exercise",
    title,
    overview,
    pointers,
    transitionMedia: options.transition ? `media/${folder}/${options.transition}` : undefined,
    transitionAlt: options.transitionAlt,
    activity,
  });

  const video = (folder, number, title, eyebrow, overview, pointers, mediaName, alt) => ({
    id: `${folder.toLowerCase()}-${String(number).padStart(2, "0")}`,
    kind: "video",
    sourceNumber: number,
    title,
    eyebrow,
    overview,
    pointers,
    media: `media/${folder}/${mediaName}`,
    alt,
  });

  const topics = [
    {
      id: "ldm-dit",
      folder: "T1",
      number: "01",
      title: "Latent Diffusion & DiT",
      shortTitle: "LDM + DiT",
      kicker: "Architectures",
      subtitle: "Compress the canvas, then let Transformers denoise it.",
      duration: "40 min",
      accent: "#8f7cff",
      objectives: [
        "Explain why latent diffusion moves denoising into a compressed space.",
        "Trace text, timestep, and positional conditioning through a DiT.",
        "Distinguish noise prediction from velocity prediction in transformer denoisers.",
      ],
      sources: [
        ["Latent Diffusion Models", "https://arxiv.org/abs/2112.10752"],
        ["Scalable Diffusion Models with Transformers", "https://arxiv.org/abs/2212.09748"],
        ["SiT", "https://arxiv.org/abs/2401.08740"],
      ],
      steps: [
        slide("T1", 1, "Denoising follows a learned reverse chain", "Pixel-space diffusion", "A DDPM corrupts a clean sample along a known forward process and learns the reverse transitions that move noise back toward data. The network is queried at many noise levels, so the sampling path is iterative rather than a single reconstruction.", ["The forward transition q is fixed; the reverse transition pθ is learned.", "Every reverse step conditions on the current noisy state.", "The endpoint is a sample in pixel space."], { transition: "0_1.m4v", transitionAlt: "Opening animation of the DDPM forward and reverse processes." }),
        slide("T1", 2, "The path connects two very different spaces", "Distribution view", "The reverse process transports probability mass from a simple noise distribution to the structured image distribution. Thinking in distributions clarifies why the model must learn a whole path rather than memorizing a single clean-up operation.", ["The noise prior is easy to sample.", "The data distribution is structured and highly non-Gaussian.", "Intermediate states provide a bridge between them."]),
        slide("T1", 3, "Pixel diffusion builds a path for every pixel", "Scaling pressure", "In a full-resolution diffusion model, each spatial value participates in the noising and denoising trajectory. The model therefore processes hundreds of thousands of variables at every denoising step.", ["A 512×512 RGB image contains 786,432 scalar channel values.", "Spatial resolution directly expands the model input.", "Video adds a temporal axis on top of the spatial cost."], { transition: "2_3.m4v", transitionAlt: "Animation expanding a distribution-level path into pixel-wise trajectories.", quiz: quiz("Why can pixel-space diffusion become expensive?", "Identify the source of the scaling pressure highlighted here.", [["steps", "Every pixel participates at every denoising step", true, "Correct. Both spatial dimensionality and repeated denoising contribute to the cost."], ["labels", "It requires a class label for every pixel", false, "Conditioning labels do not scale one-for-one with pixels."], ["invert", "It must analytically invert every neural layer", false, "Diffusion sampling does not require each neural layer to be invertible."]], "The model repeatedly processes a high-dimensional spatial state.") }),
        slide("T1", 4, "High resolution strains pixel-space scaling", "Motivation", "The slide makes the computational consequence concrete: a 512×512 image already contains 262,144 spatial positions before color channels or multiple video frames are counted.", ["Compute grows with resolution and denoising steps.", "Memory also grows with activation maps.", "A compressed representation can reduce both burdens."]),
        slide("T1", 5, "Latent diffusion changes where denoising happens", "Latent Diffusion Models", "LDMs introduce an encoder and decoder around the diffusion process. Images are encoded into a lower-dimensional latent representation, the generative path is learned there, and a decoder reconstructs pixels only after sampling.", ["The encoder maps images to a compact latent code.", "The diffusion model works on that code rather than raw pixels.", "The decoder returns the final latent to image space."], { transition: "4_5.m4v", transitionAlt: "Animation inserting a latent representation between image data and the diffusion process." }),
        slide("T1", 6, "Compression separates perception from generation", "Two-stage design", "The autoencoder learns a perceptually useful image representation; the diffusion model learns the distribution of those latents. This division makes high-resolution generation practical but ties the generator to the representation quality of the autoencoder.", ["Stage one learns encode/decode mappings.", "Stage two learns the latent generative process.", "Decoder errors place a ceiling on final reconstruction fidelity."], { transition: "5_6.m4v", transitionAlt: "Animation showing the encoder, latent diffusion chain, and decoder as a two-stage system." }),
        slide("T1", 7, "Text conditioning steers the latent trajectory", "Conditional generation", "A text encoder maps a prompt into conditioning features that guide the denoiser. The generative model still evolves a noisy latent, but each prediction is now informed by the requested semantics.", ["The prompt is encoded once into features.", "Conditioning can enter through attention or adaptive normalization.", "The decoder converts only the final guided latent to pixels."], { transition: "6_7.m4v", transitionAlt: "Animation adding a text encoder and prompt conditioning to the latent diffusion pipeline." }),
        slide("T1", 8, "The VAE is part of the quality budget", "Representation refinement", "A latent generator cannot recover details that its autoencoder systematically removes. LDM systems therefore refine the VAE with stable weight averaging and data chosen for visual quality, balancing compression against faithful reconstruction.", ["EMA smooths parameter updates and often stabilizes evaluation quality.", "Aesthetic fine-tuning shifts the reconstruction distribution.", "The latent bottleneck is efficient, but it is not free."], { transition: "7_8.m4v", transitionAlt: "Animation focusing on VAE refinement with EMA and aesthetic data." }),
        slide("T1", 9, "DiT replaces the denoising U-Net with a Transformer", "Denoising Transformers", "Diffusion Transformers treat a noisy spatial representation as a token sequence and process it with transformer blocks. The denoising objective stays familiar; the backbone changes from convolutional multiscale processing to token mixing.", ["Patchification creates a sequence of image or latent tokens.", "Self-attention mixes information globally.", "Model scaling follows familiar Transformer depth and width axes."]),
        slide("T1", 10, "Noise becomes a token sequence", "Patchify", "The noisy input is divided into patches and linearly embedded. Each patch becomes a token whose feature width is chosen by the model, giving the Transformer a fixed-length sequence for a fixed resolution and patch size.", ["Larger patches shorten the sequence.", "Each token summarizes a local spatial region.", "Patch dimension and hidden width need not be identical."]),
        slide("T1", 11, "Position must be added explicitly", "Spatial structure", "Self-attention alone is permutation equivariant, so DiT adds positional information to preserve the 2D layout of the patch sequence. Without it, the same tokens in a different order would be indistinguishable.", ["Positions identify where each patch belongs.", "The representation is a sequence, but the source is a grid.", "Positional encodings complement content embeddings."]),
        slide("T1", 12, "Class information provides semantic context", "Conditioning", "A class label such as “a white husky” is embedded into a conditioning vector. That vector modulates the denoising computation so the same noisy state can be directed toward different semantic outcomes.", ["Class and text conditioning play analogous roles.", "The condition does not replace the noisy input.", "Classifier-free guidance can combine conditional and unconditional predictions."], { quiz: quiz("What changes when a class label is supplied?", "Choose the best description of conditional denoising.", [["guide", "The same noisy state is denoised under semantic guidance", true, "Correct. Conditioning changes the predicted direction without replacing the noisy input."], ["position", "The label supplies spatial positions", false, "Positional embeddings, not class labels, encode patch location."], ["decode", "The label directly decodes pixels", false, "The denoiser still predicts a denoising target before reconstruction."]], "Conditioning steers the trajectory while the noisy state remains the model input.") }),
        slide("T1", 13, "The timestep tells the model how corrupted the input is", "Noise-level conditioning", "The same visual structure demands different corrections at different noise levels. A timestep embedding tells the network where the current sample lies on the denoising path.", ["High-noise states require global semantic decisions.", "Low-noise states emphasize refinement.", "The timestep is embedded and injected into every block."], { alt: "A DiT token sequence paired with a timestep t." }),
        slide("T1", 14, "Adaptive normalization injects the condition", "DiT block", "DiT uses adaptive LayerNorm to turn the timestep and semantic condition into modulation parameters. Attention and feed-forward sublayers are therefore conditioned without concatenating the same context to every spatial token.", ["Layer normalization standardizes token features.", "Condition-derived scale and shift modulate those features.", "Residual gates can also be predicted from the condition."], { quiz: quiz("Why use adaptive LayerNorm in DiT?", "Connect the conditioning vector to the Transformer block.", [["modulate", "To modulate normalized token features with time and semantic context", true, "Correct. The condition produces scale, shift, and often residual gates."], ["compress", "To reduce the number of image patches", false, "Patch size controls sequence length; adaptive normalization controls features."], ["likelihood", "To compute an exact change-of-variables likelihood", false, "That is a normalizing-flow concern, not the purpose of adaLN."]], "Adaptive normalization is a clean way to condition every Transformer block.") }),
        slide("T1", 15, "Conditioning reaches every residual block", "adaLN-Zero", "The conditioning pathway supplies modulation and residual scaling values throughout the network. Zero-initialized residual gates make the initial block close to the identity, which helps stabilize deep diffusion Transformer training.", ["A shared condition drives multiple modulation parameters.", "Attention and MLP branches are modulated separately.", "Zero gates let useful residual updates emerge gradually."]),
        slide("T1", 16, "Scale and shift are learned functions of context", "Adaptive LayerNorm", "For normalized activations, adaLN applies a condition-dependent scale γ and shift β. The context vector may combine the timestep with a class or text embedding before an MLP produces these parameters.", ["Normalization removes the current mean and variance.", "γ controls feature amplitude.", "β controls feature offset."], { alt: "The adaptive LayerNorm equation with scale and shift predicted from conditioning." }),
        slide("T1", 17, "A diffusion Transformer can predict noise and variance", "DDPM parameterization", "In a conventional diffusion setup, the DiT output head predicts the noise component and may also predict variance parameters for the reverse transition. The Transformer is the backbone; the probabilistic interpretation still comes from diffusion.", ["Noise prediction estimates the corruption component.", "Variance affects the reverse-process distribution.", "The output is unpatchified back to the spatial layout."], { transition: "16_17.m4v", transitionAlt: "Animation moving from adaptive normalization to DiT noise and variance outputs." }),
        slide("T1", 18, "The same backbone can predict flow velocity", "Flow parameterization", "Replacing the noise target with a velocity target connects DiT to flow-matching formulations such as SiT. Architecture and conditioning remain similar, while the target and sampler become a continuous transport field.", ["Velocity predicts how the state should move in time.", "A linear path enables simple training targets.", "Parameterization changes the learning problem even when outputs are algebraically related."], { quiz: quiz("What changes when DiT predicts velocity?", "Identify the conceptual shift from a DDPM output head.", [["field", "The network learns the time derivative of the transport path", true, "Correct. The output is a velocity field used by an ODE-style sampler."], ["tokens", "The model no longer uses image tokens", false, "Patch tokens can be used with either target."], ["condition", "Class and timestep conditioning disappear", false, "The velocity model remains conditioned on time and semantics."]], "Velocity prediction turns the denoiser into a learned transport field.") }),
        slide("T1", 19, "SiT pairs Transformer scaling with simpler transport", "Scalable interpolation", "SiT studies diffusion-style generation through stochastic interpolants and velocity prediction. The broader lesson is that a DiT backbone is not tied to one sampler: its token architecture can support diffusion, flow matching, and related paths.", ["Architecture and generative path are separable design choices.", "Velocity objectives can support simpler schedules and samplers.", "The next topic asks what the network itself should directly predict."]),
      ],
    },
    {
      id: "jit",
      folder: "T2",
      number: "02",
      title: "Just image Transformers",
      shortTitle: "JiT",
      kicker: "Prediction targets",
      subtitle: "Return diffusion to clean-image prediction on raw pixels.",
      duration: "35 min",
      accent: "#20d8c7",
      objectives: [
        "Translate between clean-data, noise, and velocity parameterizations.",
        "Explain why direct x-prediction can help in high-dimensional pixel space.",
        "Write the JiT x-prediction training step with a velocity loss.",
      ],
      sources: [
        ["Back to Basics: Let Denoising Generative Models Denoise", "https://arxiv.org/abs/2511.13720"],
        ["CVPR 2026 paper", "https://openaccess.thecvf.com/content/CVPR2026/papers/Li_Back_to_Basics_Let_Denoising_Generative_Models_Denoise_CVPR_2026_paper.pdf"],
      ],
      steps: [
        slide("T2", 1, "Begin with data, noise, and an interpolated state", "Common setup", "JiT uses the linear interpolation zₜ = t x + (1−t) ε. A clean sample x, Gaussian noise ε, and time t fully determine the noisy input supplied to the network.", ["At t=0, zₜ is noise.", "At t=1, zₜ is data.", "The same state can support x-, ε-, or v-prediction."], { transition: "0_1.m4v", transitionAlt: "Opening animation introducing data, noise, and the linear interpolation." }),
        slide("T2", 2, "Recover clean data algebraically", "Solve for x", "Rearranging the interpolation isolates the clean sample: x = [zₜ − (1−t)ε] / t. The identity shows that parameterizations are connected, but it does not mean they are equally easy for a finite-capacity network to predict.", ["The conversion becomes sensitive near t=0.", "x lies on the natural-data manifold.", "Direct network output and loss space are separate choices."], { transition: "1_2.m4v", transitionAlt: "Animation rearranging the interpolation to solve for the clean sample." }),
        slide("T2", 3, "Recover the noise algebraically", "Solve for ε", "The same interpolation gives ε = (zₜ − t x)/(1−t). Noise and clean-data predictions can be converted into one another when zₜ and t are known.", ["The conversion becomes sensitive near t=1.", "Noise occupies the full ambient space.", "Algebraic equivalence does not imply identical optimization."], { transition: "2_3.m4v", transitionAlt: "Animation rearranging the interpolation to solve for noise." }),
        slide("T2", 4, "Velocity links the two endpoints", "Flow view", "For the linear path, velocity is constant along a paired trajectory: v = d zₜ/dt = x−ε. It can also be written as (zₜ−ε)/t or (x−zₜ)/(1−t), depending on which endpoint a network predicts.", ["Velocity combines signal and noise.", "The training target is x−ε.", "Sampling integrates a predicted velocity field."], { transition: "3_4.m4v", transitionAlt: "Animation deriving velocity from the linear interpolation.", quiz: quiz("What is the velocity target on the linear path?", "Use zₜ = t x + (1−t)ε.", [["difference", "x − ε", true, "Correct. Differentiating the path with respect to t gives x − ε."], ["sum", "x + ε", false, "The noise coefficient decreases with time, so its derivative is negative."], ["state", "zₜ", false, "zₜ is the current state, not its time derivative."]], "The linear interpolation has target velocity x − ε.") }),
        slide("T2", 5, "Prediction space and loss space can differ", "Two design axes", "A network may directly output ε or v while training under a transformed loss. The slide compares the familiar noise- and velocity-output cases and makes the hidden conversions explicit.", ["Direct output determines what information must pass through the network.", "The loss determines how errors are weighted.", "Transformations depend on t and can amplify errors near endpoints."], { transition: "4_5.m4v", transitionAlt: "Animation comparing epsilon and velocity prediction under different losses." }),
        slide("T2", 6, "There are nine output–loss combinations", "Parameterization grid", "With three direct outputs (x, ε, v) and three reference loss spaces, there are nine legitimate formulations. Off-diagonal choices transform the output before evaluating the selected loss.", ["x-prediction means netθ directly returns xθ.", "A v-loss can still be computed from xθ.", "Time-dependent transformations induce different effective weighting."], { transition: "5_6.m4v", transitionAlt: "Animation expanding the comparison into all nine output and loss combinations.", quiz: quiz("Does x-prediction require an x-loss?", "Separate the network output from the space where error is measured.", [["no", "No; xθ can be transformed and evaluated with a v-loss", true, "Correct. JiT directly predicts x while optimizing a velocity loss."], ["yes", "Yes; output and loss spaces must match", false, "The paper explicitly studies off-diagonal combinations."], ["only-noise", "Only ε-prediction can use transformed losses", false, "All three output spaces can be transformed into the others."]], "Prediction space and loss space are independent design choices.") }),
        slide("T2", 7, "JiT directly predicts the clean image", "Back to denoising", "The JiT network receives zₜ and t but outputs xθ. From that clean estimate, training computes vθ = (xθ−zₜ)/(1−t) and compares it with the true velocity.", ["The direct output is constrained toward the data manifold.", "The v-loss preserves a useful time weighting.", "Large raw-pixel patches can pass through a narrower hidden representation."], { filename: "7png.png", transition: "6_7.m4v", transitionAlt: "Animation adding clean-data prediction to the parameterization table.", quiz: quiz("Why might x-prediction need less capacity?", "Use the manifold argument made by JiT.", [["manifold", "Clean images lie near a lower-dimensional manifold", true, "Correct. The network can discard off-manifold noise instead of preserving it."], ["pixels", "Clean images contain fewer pixels", false, "The output has the same pixel dimensionality; the argument concerns intrinsic dimension."], ["steps", "It removes every sampling step", false, "JiT still uses an iterative sampler in the reported setup."]], "Intrinsic dimensionality, not the raw number of pixels, motivates clean-data prediction.") }),
        slide("T2", 8, "Just image Transformers remove the latent crutch", "JiT", "JiT applies a plain Vision Transformer directly to raw pixels with large patches. It uses no tokenizer, no perceptual or adversarial loss, and no representation-alignment pretraining; the key change is to let the model predict clean data.", ["Large patches keep sequence length manageable.", "A bottleneck patch embedding can be beneficial.", "The method aims for a self-contained Diffusion + Transformer recipe."], { transition: "7_8.m4v", transitionAlt: "Animation revealing the JiT paper and its clean-data prediction framing." }),
        slide("T2", 9, "Direct output choice changes high-dimensional behavior", "Evidence", "The reported ablations show that ε- and v-prediction can fail badly for large pixel patches, while x-prediction works across loss spaces. Noise-level shifts help, but do not remove the gap; bottleneck embeddings can even improve FID.", ["The 256×256 JiT-B/16 patch has 768 raw dimensions.", "x-prediction remains viable when hidden capacity is constrained.", "The result supports the manifold argument rather than a loss-weighting-only explanation."], { quiz: quiz("What do the JiT ablations isolate?", "Choose the conclusion supported by the output/loss grid.", [["output", "The direct prediction target matters beyond loss weighting", true, "Correct. x-prediction succeeds across loss spaces where other direct outputs fail."], ["schedule", "Only the timestep distribution explains the result", false, "Noise-level shifts help but do not explain the catastrophic gap."], ["tokenizer", "A stronger latent tokenizer is required", false, "JiT deliberately operates without a tokenizer."]], "The direct network output changes the effective learning problem.") }),
        practice("T2", 10, "Write one JiT training step", "Reconstruct Algorithm 1 without displaying the source slide. Your loop should build the noisy state, derive the velocity target, ask the network for a clean prediction, convert it to velocity, and compute the loss.", ["Use the linear interpolation zₜ = t x + (1−t)ε.", "The network returns x_pred—not ε_pred or v_pred.", "Clip the 1−t denominator in production code to avoid division by zero."], {
          prompt: "Complete the JiT x-prediction training step using a velocity loss.",
          starterCode: `# x: training batch\n# net(z_t, t): JiT network\n\nt = ...\neps = ...\nz_t = ...\nv_target = ...\n\nx_pred = ...\nv_pred = ...\n\nloss = ...`,
          modelSolution: `# x: training batch\nt = sample_t()\neps = randn_like(x)\nz_t = t * x + (1 - t) * eps\nv_target = (x - z_t) / clamp(1 - t, min=0.05)\n\nx_pred = net(z_t, t)\nv_pred = (x_pred - z_t) / clamp(1 - t, min=0.05)\n\nloss = mse(v_pred, v_target)`,
          rubric: [
            ["time", "Sample a diffusion time t.", "Show where the noise level comes from.", ["sample_t", "sample t", "rand.*t"]],
            ["noise", "Sample Gaussian noise ε.", "Use a noise tensor with the same shape as x.", ["randn", "normal", "gaussian"]],
            ["state", "Construct zₜ = t x + (1−t) ε.", "Interpolate between data and noise with t.", ["t * x", "t*x", "1 - t", "1-t"]],
            ["target", "Compute the velocity target.", "Use x−zₜ over 1−t, or equivalently x−ε.", ["v_target = (x - z", "v_target=(x-z", "v_target = x - eps", "v_target=x-eps"]],
            ["predict", "Predict clean data with the network.", "The direct network output should be x_pred.", ["x_pred = net", "x_pred=net", "x_hat = net", "xhat=net"]],
            ["convert", "Convert x_pred to v_pred.", "Subtract zₜ and divide by 1−t.", ["v_pred = (x_pred", "v_pred=(x_pred", "x_pred - z", "x_pred-z"]],
            ["loss", "Regress predicted velocity to the target.", "Use an MSE/L2 loss between v_pred and v_target.", ["mse", "l2", "mean_squared"]],
          ],
        }),
      ],
    },
    {
      id: "drifting",
      folder: "T3",
      number: "03",
      title: "Drifting Models",
      shortTitle: "Drifting",
      kicker: "One-step generation",
      subtitle: "Move distribution evolution into training for native one-step sampling.",
      duration: "35 min",
      accent: "#ffb33d",
      objectives: [
        "Contrast iterative inference with training-time distribution evolution.",
        "Explain zero-drift equilibrium and the role of anti-symmetry.",
        "Write the stop-gradient drifting loss from Algorithm 1.",
      ],
      sources: [["Generative Modeling via Drifting", "https://arxiv.org/abs/2602.04770"]],
      steps: [
        slide("T3", 1, "Drifting reframes where iteration happens", "Paper overview", "A Drifting Model is a one-step generator at inference: noise passes through fθ once. The iterative work happens during optimization, where each update evolves the generator’s pushforward distribution toward the data distribution.", ["qθ is the distribution induced by fθ on prior noise.", "Training changes qθ across optimizer iterations.", "Inference remains a single network evaluation."], { transition: "0_1.m4v", transitionAlt: "Opening animation introducing the Drifting Models paper and sample evolution." }),
        slide("T3", 2, "Generative transport need not be a differential equation", "New viewpoint", "Diffusion and flow models apply many small state updates during inference. Drifting asks whether a sequence of generator parameters during training can carry out that evolution instead.", ["Conventional samplers update z across timesteps.", "Drifting updates θ across training iterations.", "The final mapping sends prior samples directly to data-like samples."], { transition: "1_2.m4v", transitionAlt: "Animation contrasting iterative state transport with a non-differential-equation viewpoint." }),
        slide("T3", 3, "Optimizer steps evolve the pushforward distribution", "Training dynamics", "At iteration i, fᵢ maps fixed prior samples into a current model distribution. After learning a desired sample displacement, the next model fᵢ₊₁ should map those same prior samples to their drifted locations.", ["Use the same latent ε to compare consecutive generators.", "Parameter updates induce sample-space movement.", "The distribution moves even though no inference-time path is stored."], { transition: "2_3.m4v", transitionAlt: "Animation showing generated distributions changing from iteration i to iteration i+1." }),
        slide("T3", 4, "The drifting field is the desired sample displacement", "Definition", "For a generated point xᵢ = fᵢ(ε), the field Vₚ,ᵩ(xᵢ) describes how that sample should move so the next generator improves its pushforward distribution. Conceptually, fᵢ₊₁(ε)−fᵢ(ε) realizes this drift.", ["The field is evaluated in sample space.", "It depends on both data distribution p and model distribution q.", "A positive step follows x ← x + Vₚ,ᵩ(x)."], { transition: "3_4.m4v", transitionAlt: "Animation deriving the drifting field from consecutive generator outputs." }),
        slide("T3", 5, "Training should stop moving samples at equilibrium", "Fixed point", "A useful drifting field vanishes when the generated and data distributions match. If Vₚ,ᵩ is zero everywhere under q=p, further parameter updates no longer induce a systematic sample displacement.", ["Zero drift defines the desired fixed point.", "The loss magnitude equals the squared drift norm in the basic formulation.", "A vanishing field is necessary; uniqueness depends on the field design."], { quiz: quiz("What characterizes the desired equilibrium?", "Choose the fixed-point condition used by Drifting Models.", [["zero", "q = p and Vₚ,ᵩ = 0", true, "Correct. Matching distributions should make the field vanish."], ["noise", "q remains equal to the prior", false, "The generator should transform the prior into the data distribution."], ["large", "The drift norm is maximized", false, "Training aims to reduce the drift norm toward zero."]], "At equilibrium, generated and data distributions match and samples stop drifting.") }),
        slide("T3", 6, "Reversing source and target reverses the drift", "Directional field", "A field that moves q toward p should change sign when the distributions exchange roles. The reverse field describes movement back toward the model or noise-side distribution.", ["Vₚ,ᵩ and Vᵩ,ₚ point in opposite directions.", "Direction encodes which distribution attracts and which repels.", "This symmetry supports the equilibrium argument."]),
        slide("T3", 7, "Anti-symmetry guarantees zero drift when p=q", "Key property", "The paper requires Vₚ,ᵩ = −Vᵩ,ₚ. If p and q are equal, swapping them changes nothing but must also negate the field, so the only possibility is Vₚ,ₚ = 0.", ["Anti-symmetry is a property of the field construction.", "The proof is immediate at q=p.", "Arbitrary vector fields do not provide this guarantee."], { quiz: quiz("Why does anti-symmetry imply zero drift at q=p?", "Apply Vₚ,ᵩ = −Vᵩ,ₚ after setting q=p.", [["self", "The field must equal its own negative", true, "Correct. That equality can hold only when the field is zero."], ["kernel", "Every kernel distance becomes infinite", false, "No infinite distance is required for the argument."], ["grad", "Stop-gradient sets the field numerically to zero", false, "Stop-gradient controls optimization; anti-symmetry gives the equilibrium property." ]], "At p=q, anti-symmetry forces Vₚ,ₚ = −Vₚ,ₚ = 0.") }),
        slide("T3", 8, "The optimal generator satisfies a sample-space fixed point", "Equilibrium model", "For optimal parameters θ̂, the pushforward qθ̂ should match p and the generated samples should receive zero drift. The goal is therefore to find a model whose outputs are unchanged by the chosen drifting update.", ["fθ maps prior samples into qθ.", "θ̂ denotes the desired equilibrium parameters.", "The condition is evaluated on generated samples fθ̂(ε)."], { transition: "7_8.m4v", transitionAlt: "Animation replacing current parameters with optimal parameters at zero drift." }),
        slide("T3", 9, "A stop-gradient target turns drift into regression", "Drifting loss", "The model output x=fθ(ε) is regressed toward a detached target x+Vₚ,ᵩθ(x). Stop-gradient prevents the target branch from changing to trivially cancel the loss; the optimizer must move the generator output instead.", ["The target is recomputed from the current batch.", "Gradients flow through x on the prediction side.", "The scalar loss equals E‖V‖² in value."], { transition: "8_9.m4v", transitionAlt: "Animation converting the zero-drift condition into the stop-gradient drifting loss.", quiz: quiz("Why detach x + V in the drifting loss?", "Identify what stop-gradient prevents.", [["fixed", "It keeps the drifted target fixed during the update", true, "Correct. The network must move its output toward the target rather than changing the target branch."], ["sample", "It stops the generator from sampling noise", false, "Noise is still sampled normally."], ["zero", "It forces V to be numerically zero before training", false, "V shrinks as training approaches equilibrium; it is not clamped to zero."]], "Stop-gradient makes the current drifted point a regression target.") }),
        slide("T3", 10, "At optimum, applying the field has no effect", "Interpretation", "The fixed-point loss expresses a simple teaching signal: if a generated point still has a nonzero drift, move the generator output toward the drifted point. If no improvement remains, prediction and target coincide.", ["Nonzero V supplies a direction for the next model update.", "Zero V makes the per-sample loss vanish.", "The field defines the learning geometry."], { alt: "The drifting loss annotated with the statement that the optimal field has no effect." }),
        slide("T3", 11, "Current predictions supply repulsive negatives", "Constructing the field", "The practical field combines attraction toward positive data samples with repulsion from negative model samples. The current batch of generated outputs can be reused as negatives, making the target distribution and pushforward distribution jointly determine the update.", ["Positive samples come from pdata.", "Negative samples can be the current generated batch.", "Kernel-weighted mean shifts localize attraction and repulsion."], { transition: "10_11.m4v", transitionAlt: "Animation building the positive and negative components of the drifting field.", quiz: quiz("What roles do positive and negative samples play?", "Interpret the field as attraction minus repulsion.", [["both", "Data attract; generated negatives repel", true, "Correct. Their difference defines the practical drifting direction."], ["reverse", "Generated samples attract; data repel", false, "That would move the distribution away from the data."], ["same", "Both sets contribute only attraction", false, "Repulsion from model samples helps prevent collapse and defines the anti-symmetric construction."]], "The field combines data attraction with model-sample repulsion.") }),
        practice("T3", 12, "Write the Drifting Model training loss", "Reconstruct Algorithm 1 from the paper. Generate a batch, reuse current outputs as negatives, compute the drift, detach the drifted target, and regress the generator output toward it.", ["The generator is a one-step map x=f(ε).", "The drifted point is a target, not a second differentiable prediction path.", "The batch of x values can supply y_neg."], {
          prompt: "Complete one Drifting Model loss evaluation using positive data and generated negatives.",
          starterCode: `# f: generator\n# y_pos: data samples [N_pos, D]\n\neps = ...\nx = ...\ny_neg = ...\n\nV = ...\nx_drifted = ...\n\nloss = ...`,
          modelSolution: `# f: generator\n# y_pos: data samples [N_pos, D]\neps = randn([N, C])\nx = f(eps)\ny_neg = x\n\nV = compute_V(x, y_pos, y_neg)\nx_drifted = stopgrad(x + V)\n\nloss = mse(x, x_drifted)`,
          rubric: [
            ["noise", "Sample prior noise ε.", "Start from a random latent batch.", ["randn", "normal", "gaussian"]],
            ["generate", "Generate x=f(ε).", "Run the one-step generator on the prior.", ["f(e", "generator(e", "model(e"]],
            ["negative", "Reuse generated x as y_neg.", "Current predictions can serve as negative samples.", ["y_neg = x", "y_neg=x", "negative = x"]],
            ["field", "Compute V from x, y_pos, and y_neg.", "The field needs generated queries plus positive and negative sets.", ["compute_v(", "compute v(", "v = compute", "v=compute"]],
            ["detach", "Detach the target x+V.", "Use stopgrad/detach so the target branch is fixed.", ["stopgrad", "detach", "no_grad"]],
            ["loss", "Regress x to x_drifted with MSE.", "Compare the generator output with the detached drifted target.", ["mse", "l2", "mean_squared"]],
          ],
        }, { transition: "11_12.m4v", transitionAlt: "Animation revealing the paper algorithm before the editable reconstruction exercise." }),
        slide("T3", 13, "One-step generation can remain competitive", "Reported results", "The paper reports strong one-evaluation ImageNet samples and compares them with improved MeanFlow. The result illustrates the payoff of evolving the distribution during training: the deployed generator needs no numerical trajectory.", ["Sampling uses one native generator evaluation.", "Reported latent-space FID reaches 1.54 on ImageNet 256×256.", "The comparison is empirical; field design and equilibrium uniqueness remain open research questions."]),
      ],
    },
    {
      id: "robotics",
      folder: "T4",
      number: "04",
      title: "Denoising for Robotics",
      shortTitle: "Robotics",
      kicker: "Worlds & policies",
      subtitle: "Use generative models as world simulators and action policies.",
      duration: "30 min",
      accent: "#65b7ff",
      objectives: [
        "Separate world simulation from policy learning.",
        "Explain how UniSim conditions future observations on actions and history.",
        "Describe diffusion-policy prediction, execution, and observation horizons.",
      ],
      sources: [
        ["UniSim: Learning Interactive Real-World Simulators", "https://arxiv.org/abs/2310.06114"],
        ["Diffusion Policy", "https://arxiv.org/abs/2303.04137"],
      ],
      steps: [
        slide("T4", 1, "Denoising supports both worlds and decisions", "Robotics overview", "Generative denoising enters robotics in two complementary places. A world simulator predicts what observations follow an action; a policy generates which action sequence to execute from the current observations.", ["World models generate future experience.", "Policies generate robot controls.", "Both can be conditional diffusion models, but their outputs differ."], { quiz: quiz("What is the key distinction?", "Separate the two robotics uses of denoising.", [["output", "World models predict observations; policies predict actions", true, "Correct. Conditioning may overlap, but the generated variable changes."], ["same", "Both always predict pixels", false, "A diffusion policy denoises an action sequence."], ["none", "Only world simulators use denoising", false, "Diffusion Policy applies denoising directly in action space."]], "The output variable distinguishes simulation from policy learning.") }),
        slide("T4", 2, "UniSim learns an interactive visual world", "World simulation", "UniSim is a video diffusion model designed to respond to actions ranging from language instructions to low-level robot and camera controls. It orchestrates heterogeneous datasets so different sources contribute objects, actions, viewpoints, and behaviors.", ["The simulator predicts visual outcomes of actions.", "Data sources include internet media, robotics, navigation, and scans.", "A shared action interface helps combine otherwise incompatible datasets."], { transition: "1_2.m4v", transitionAlt: "Animation opening the UniSim interactive demonstration." }),
        slide("T4", 3, "Denoise the next observation under an action condition", "Conditional objective", "During training, UniSim corrupts the target observation and learns to reconstruct the next visual state conditioned on the previous observation and action. At rollout time, generated frames become context for later predictions.", ["The noisy variable is a future observation.", "Condition c includes an action and visual history.", "Autoregressive rollouts support long-horizon interaction."], { transition: "2_3.m4v", transitionAlt: "Animation turning the UniSim interface into a conditional denoising objective.", quiz: quiz("What does UniSim denoise?", "Identify the generated variable in the world model.", [["future", "A future visual observation", true, "Correct. Actions and history condition the denoising of the next observation."], ["action", "Only the robot action", false, "That is the policy-learning formulation."], ["label", "A class label", false, "Labels may condition a model, but the output here is visual experience."]], "UniSim denoises future observations conditioned on actions and history.") }),
        slide("T4", 4, "Actions may be expressed in language", "Universal interface", "A command such as “pick the blackboard rubber” can act as the condition c. Language provides a common high-level action representation when low-level controls differ across datasets or robot embodiments.", ["Text can describe human or robot interaction.", "Continuous controls can be embedded alongside language.", "The condition specifies what change the simulator should render."], { alt: "A language action condition paired with an image observation." }),
        slide("T4", 5, "History conditioning enables long rollouts", "UniSim pipeline", "UniSim predicts a variable-length block of future frames from noisy context and an action. Previously generated frames are deliberately re-noised during inference, reducing the mismatch between training inputs and accumulated rollout errors.", ["Actions can be motor controls, text, or camera motion.", "Observation history supplies partially observable state.", "Re-noising generated context supports autoregressive stability."], { transition: "4_5.m4v", transitionAlt: "Animation expanding a single conditional prediction into the UniSim training and rollout pipeline." }),
        slide("T4", 6, "Diffusion Policy denoises action trajectories", "Policy learning", "Diffusion Policy keeps the observation as a condition and changes the generated variable from an image to a sequence of robot actions. This makes multimodal, high-dimensional, temporally correlated behavior a conditional generation problem.", ["The output x represents robot actions.", "Visual observations are encoded once and reused across denoising steps.", "The loss predicts noise added to demonstrated action sequences."], { transition: "5_6.m4v", transitionAlt: "Animation moving from world simulation to the Diffusion Policy formulation.", quiz: quiz("Why generate an action sequence instead of one action?", "Connect the prediction horizon to robot behavior.", [["consistent", "It improves temporal consistency while preserving multiple valid plans", true, "Correct. A sequence commits to one coherent action mode over a short horizon."], ["pixels", "It reduces image resolution", false, "The generated variable is an action trajectory, not an image."], ["open", "It eliminates the need for closed-loop replanning", false, "Diffusion Policy executes only part of the prediction and then replans."]], "Sequence prediction balances coherent plans with closed-loop responsiveness.") }),
        slide("T4", 7, "Predict far, execute briefly, then replan", "Receding horizon control", "At time t, the policy conditions on an observation horizon Tₒ, predicts an action horizon Tₚ, executes only Tₐ actions, and then observes again. This receding-horizon design combines smooth action chunks with feedback-driven correction.", ["Tₒ is the observation history.", "Tₚ is the predicted action sequence length.", "Tₐ is the shorter executed prefix before replanning."], { transition: "6_7.m4v", transitionAlt: "Animation deriving observation, prediction, and action horizons in Diffusion Policy.", quiz: quiz("Why is Tₐ usually shorter than Tₚ?", "Interpret the receding-horizon controller.", [["replan", "To replan from fresh observations before committing to the full prediction", true, "Correct. The unexecuted suffix provides context but does not prevent feedback."], ["train", "Because the model cannot train on long sequences", false, "The model can predict a longer horizon than it executes."], ["noise", "Because only the first action contains noise", false, "The entire trajectory is denoised; execution length is a control choice."]], "Execute a short prefix, observe again, and produce a new coherent plan.") }),
        video("T4", 8, "Watch a Diffusion Policy close the loop", "Robot demonstration", "The Push-T demonstration shows a denoised action sequence being executed in a real robot loop. Watch for coherent multi-step motion, recovery through replanning, and the way the action horizon commits to one local strategy.", ["The policy maps recent observations to an action trajectory.", "Only a prefix is executed before the next observation.", "The final frame reconnects the demonstration to the horizon diagram."], "8.m4v", "A real robot executes a Diffusion Policy trajectory and pushes a T-shaped object toward its goal."),
      ],
    },
    {
      id: "metrics",
      folder: "T5",
      number: "05",
      title: "Quality Metrics",
      shortTitle: "Metrics",
      kicker: "Evaluation",
      subtitle: "Measure fidelity, diversity, perception, and text–image alignment.",
      duration: "30 min",
      accent: "#ff6f91",
      objectives: [
        "Explain what Inception Score and FID measure—and what they miss.",
        "Describe finite-sample bias and the motivation for FID∞.",
        "Choose between distributional, perceptual, and text-alignment metrics.",
      ],
      sources: [
        ["Inception Score", "https://arxiv.org/abs/1606.03498"],
        ["FID", "https://arxiv.org/abs/1706.08500"],
        ["Effectively Unbiased FID / FID∞", "https://arxiv.org/abs/1911.07023"],
        ["LPIPS", "https://arxiv.org/abs/1801.03924"],
        ["CLIPScore", "https://arxiv.org/abs/2104.08718"],
      ],
      steps: [
        slide("T5", 1, "Evaluation needs more than visual inspection", "Quality metrics", "Generative samples can look compelling while missing modes, repeating training examples, or ignoring a condition. Metrics compress different aspects of quality into comparable numbers, but every metric carries assumptions and blind spots.", ["No single score captures every notion of quality.", "Use quantitative metrics with qualitative inspection.", "Match the metric to the failure mode you care about."], { alt: "Quality metrics title slide with a researcher looking through a microscope." }),
        slide("T5", 2, "Real and generated distributions may fail differently", "Distribution comparison", "A generator can place samples near the real-data region while covering only part of it, or cover broadly while producing unrealistic points. Fidelity and diversity are related but distinct properties.", ["High fidelity means individual samples look plausible.", "High diversity means the generator covers meaningful modes.", "Memorization can look good locally without matching the distribution."], { transition: "1_2.m4v", transitionAlt: "Animation introducing real and generated distributions with example images." }),
        slide("T5", 3, "Pixel distances are a poor semantic yardstick", "Representation choice", "Two perceptually similar images can be far apart pixel-by-pixel because of a small shift, while a blurred or structurally wrong image may achieve a deceptively small pixel loss. Useful metrics compare learned semantic features instead.", ["Pixel alignment is fragile to nuisance transformations.", "Object attributes live at multiple feature levels.", "The feature extractor determines what the metric notices."]),
        slide("T5", 4, "Object attributes require learned features", "Semantic comparison", "Edges, shapes, textures, colors, and object identity are not captured equally by raw pixels. A pretrained vision network supplies a representation in which perceptual or semantic comparisons are more meaningful.", ["Early layers emphasize local patterns.", "Later layers emphasize category-level semantics.", "Dataset bias in the feature model becomes metric bias."], { quiz: quiz("Why compare learned features instead of pixels?", "Choose the strongest reason for generative evaluation.", [["semantic", "Features can be more aligned with perceptual and semantic similarity", true, "Correct. They reduce sensitivity to irrelevant pixel-level differences."], ["exact", "Features make the score mathematically exact", false, "A learned representation introduces its own assumptions and biases."], ["free", "Feature comparison requires no pretrained model", false, "Most such metrics rely on a fixed pretrained encoder."]], "Learned representations often compare the attributes people actually perceive.") }),
        slide("T5", 5, "Inception features turn images into semantic vectors", "Feature extractor", "The Inception network maps each generated image to a class-posterior distribution and internal features. These outputs underpin two classic metrics: Inception Score uses predicted labels, while FID compares feature distributions.", ["The encoder is fixed during evaluation.", "Classifier posteriors support Inception Score.", "Intermediate embeddings support FID."]),
        slide("T5", 6, "Inception Score rewards confidence and variety", "Inception Score", "IS is exp(Eₓ KL[p(y|x) ‖ p(y)]). It is high when each image has a sharp class prediction and the marginal class distribution is broad across the generated set.", ["Low conditional entropy suggests recognizable samples.", "High marginal entropy suggests class diversity.", "IS never compares against the real dataset."], { transition: "5_6.m4v", transitionAlt: "Animation mapping example images through an Inception-style feature network and introducing Inception Score.", quiz: quiz("What is a core limitation of Inception Score?", "Look at which distributions appear in its definition.", [["real", "It does not compare generated samples with real data", true, "Correct. A confident, diverse but shifted generator can still score well."], ["labels", "It cannot use classifier predictions", false, "Classifier predictions are central to IS."], ["many", "It can evaluate only one generated image", false, "IS is estimated over a sample set."]], "IS measures confidence and diversity under one classifier, not real–generated agreement.") }),
        slide("T5", 7, "FID compares real and generated feature clouds", "Fréchet Inception Distance", "FID embeds both datasets with Inception, approximates each feature distribution as a Gaussian, and measures the Fréchet distance between their means and covariances.", ["Mean differences capture a shift in feature centers.", "Covariance differences capture spread and correlations.", "Lower FID indicates closer fitted feature distributions."]),
        slide("T5", 8, "Means and covariances summarize the comparison", "FID geometry", "For real statistics (μᵣ,Σᵣ) and generated statistics (μg,Σg), FID combines squared mean distance with a covariance term. It responds to both sample fidelity and coverage, but only through Gaussian second-order statistics.", ["FID is zero when the fitted Gaussians match.", "The score is not a direct likelihood.", "Encoder choice and preprocessing materially affect the value."], { transition: "7_8.m4v", transitionAlt: "Animation building the real and generated feature means and covariance ellipses.", quiz: quiz("Which statistics does standard FID compare?", "Recall the Gaussian approximation in feature space.", [["moments", "Feature means and covariances", true, "Correct. FID compares first and second moments of fitted Gaussians."], ["pixels", "Per-pixel medians only", false, "FID operates in Inception feature space."], ["captions", "Text and image cosine similarity", false, "That describes CLIPScore."]], "FID is a Gaussian feature-space distance based on means and covariances.") }),
        slide("T5", 9, "FID∞ extrapolates away finite-sample bias", "Effectively unbiased FID", "Empirical FID is biased at finite sample sizes, and the bias can depend on the generator. FID∞ estimates FID at several sample counts, fits the trend against 1/N, and uses the intercept at 1/N=0 as the infinite-sample estimate.", ["Compute FID at multiple N values.", "Regress the scores against reciprocal sample size.", "The y-intercept estimates FID as N approaches infinity."], { transition: "8_9.m4v", transitionAlt: "Animation plotting FID estimates against reciprocal sample size and extrapolating to FID infinity.", quiz: quiz("What does the FID∞ intercept represent?", "Read the extrapolation axis carefully.", [["limit", "The estimated score as sample size N tends to infinity", true, "Correct. The intercept is evaluated at 1/N=0."], ["zero", "The FID of an empty dataset", false, "It is a limit estimate, not an evaluation with zero samples."], ["best", "The minimum score among finite batches", false, "FID∞ is obtained by fitted extrapolation, not by selecting the best batch."]], "FID∞ targets the infinite-sample limit of the metric.") }),
        slide("T5", 10, "LPIPS compares deep features across layers", "Perceptual similarity", "LPIPS measures the distance between two aligned images using normalized activations from several layers of a pretrained vision network, with learned channel weights calibrated to human perceptual judgments.", ["It is a pairwise image metric, not a distribution score.", "Multiple layers capture both local and semantic differences.", "Lower LPIPS means greater perceptual similarity."], { transition: "9_10.m4v", transitionAlt: "Animation moving from FID infinity to multi-layer perceptual comparison." }),
        slide("T5", 11, "The representation inherits ImageNet’s worldview", "Metric bias", "Inception-based metrics are shaped by a classifier trained on ImageNet. They may underweight details outside that taxonomy and can disagree with human judgments on domains far from natural object photographs.", ["A metric is only as domain-appropriate as its encoder.", "Preprocessing and implementation must be standardized.", "Report more than one signal for new domains."], { alt: "An ImageNet collage illustrating the training domain behind Inception-based metrics." }),
        slide("T5", 12, "CLIPScore tests text–image alignment", "Conditional evaluation", "For captioned generation, distributional image quality is not enough: the image must also express the prompt. CLIPScore embeds text and image into a shared space and uses their cosine similarity as a reference-free alignment score.", ["The score can be computed without a ground-truth caption.", "It reflects CLIP’s learned semantic associations.", "High alignment does not guarantee photorealism or diversity."], { alt: "CLIPScore title over a contrastive text and image embedding diagram." }),
        slide("T5", 13, "CLIP supplies a shared embedding space", "Contrastive representation", "CLIP is trained to bring matched image–text pairs together and separate mismatched pairs. CLIPScore reuses that geometry to ask whether a generated image and its prompt point in a similar direction.", ["Text and image use separate encoders.", "Both embeddings live in one comparison space.", "Cosine similarity removes sensitivity to embedding magnitude."], { transition: "12_13.m4v", transitionAlt: "Animation constructing the joint CLIP text–image embedding space." }),
        slide("T5", 14, "CLIPScore is a scaled, clipped cosine", "Formula", "The original metric rescales max(cos(c,v),0), commonly with weight w=2.5. Negative similarities are clipped, and larger positive cosine alignment yields a higher score.", ["c is the text embedding.", "v is the visual embedding.", "Use CLIPScore beside image-quality and diversity metrics, not as a replacement."], { quiz: quiz("Which question does CLIPScore answer best?", "Choose the evaluation target aligned with its formula.", [["alignment", "Does the image semantically match the prompt?", true, "Correct. It measures text–image embedding alignment."], ["coverage", "Does the generator cover every real-data mode?", false, "Distribution coverage needs a set-level metric."], ["pixels", "Are two images exactly aligned pixel-by-pixel?", false, "CLIPScore compares semantic embeddings, not pixels."]], "CLIPScore is primarily a prompt–image alignment metric.") }),
      ],
    },
  ];

  const topicById = Object.fromEntries(topics.map((topic) => [topic.id, topic]));
  const root = document.getElementById("root");
  if (!root) throw new Error("Advanced Generative Models Study Studio could not find its root element.");

  let state = loadState();
  let route = parseRoute();
  let transitionPhase = false;
  let utilitiesOpen = false;
  let quizOpen = true;
  let toastTimer = null;

  function emptyTopicState(topic) {
    return {
      currentStepId: topic.steps[0].id,
      visitedStepIds: [],
      notes: {},
      summary: "",
      attempts: {},
      quizzes: {},
      quizOrders: Object.fromEntries(
        topic.steps
          .filter((step) => step.quiz)
          .map((step) => [step.id, shuffledOptionIds(step.quiz.options)]),
      ),
    };
  }

  function shuffledOptionIds(options) {
    const ids = options.map((option) => option.id);
    for (let index = ids.length - 1; index > 0; index -= 1) {
      const random = new Uint32Array(1);
      if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(random);
      else random[0] = Math.floor(Math.random() * 2 ** 32);
      const swapIndex = random[0] % (index + 1);
      [ids[index], ids[swapIndex]] = [ids[swapIndex], ids[index]];
    }
    return ids;
  }

  function normalizedQuizOrders(topic, incomingOrders, fallbackOrders) {
    return Object.fromEntries(
      topic.steps
        .filter((step) => step.quiz)
        .map((step) => {
          const optionIds = step.quiz.options.map((option) => option.id);
          const order = incomingOrders?.[step.id];
          const isValid = Array.isArray(order)
            && order.length === optionIds.length
            && new Set(order).size === optionIds.length
            && order.every((id) => optionIds.includes(id));
          return [step.id, isValid ? order : fallbackOrders[step.id]];
        }),
    );
  }

  function defaultState() {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      topics: Object.fromEntries(topics.map((topic) => [topic.id, emptyTopicState(topic)])),
    };
  }

  function normalizeState(value) {
    const fresh = defaultState();
    if (!value || typeof value !== "object") return fresh;
    for (const topic of topics) {
      const incoming = value.topics?.[topic.id];
      if (!incoming || typeof incoming !== "object") continue;
      const validIds = new Set(topic.steps.map((step) => step.id));
      const fallbackOrders = fresh.topics[topic.id].quizOrders;
      fresh.topics[topic.id] = {
        currentStepId: validIds.has(incoming.currentStepId) || incoming.currentStepId === SUMMARY_ID ? incoming.currentStepId : topic.steps[0].id,
        visitedStepIds: Array.isArray(incoming.visitedStepIds) ? incoming.visitedStepIds.filter((id) => validIds.has(id)) : [],
        notes: incoming.notes && typeof incoming.notes === "object" ? incoming.notes : {},
        summary: typeof incoming.summary === "string" ? incoming.summary : "",
        attempts: incoming.attempts && typeof incoming.attempts === "object" ? incoming.attempts : {},
        quizzes: incoming.quizzes && typeof incoming.quizzes === "object" ? incoming.quizzes : {},
        quizOrders: normalizedQuizOrders(topic, incoming.quizOrders, fallbackOrders),
      };
    }
    return fresh;
  }

  function loadState() {
    try {
      const normalized = normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    } catch {
      return defaultState();
    }
  }

  function saveState(message) {
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (message) showToast(message);
  }

  function parseRoute() {
    const match = location.hash.match(/^#\/topic\/([^/]+)$/);
    return match && topicById[match[1]] ? { page: "topic", topicId: match[1] } : { page: "home" };
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function nablaMascotMarkup(emote, color) {
    const safeEmote = escapeHtml(emote);
    const safeColor = escapeHtml(color);
    const symbols = {
      checkmark: '<path class="nabla-fallback-symbol" pathLength="1" d="M42 103 L78 136 L150 48"></path>',
      incorrect: '<path class="nabla-fallback-symbol" d="M52 51 L140 141 M140 51 L52 141"></path>',
      question: '<g class="nabla-fallback-symbol"><path d="M62 66 C62 37 82 22 105 22 C132 22 148 39 148 61 C148 82 132 92 119 102 C108 110 105 119 105 132"></path><circle cx="105" cy="157" r="8"></circle></g>',
    };
    return `
      <span class="nabla-mascot-stack loading" data-renderer="safe">
        <svg class="nabla-static-mascot" data-emote="${safeEmote}" viewBox="0 0 192 192" aria-hidden="true" style="--nabla-fallback-color:${safeColor}">
          <g class="nabla-fallback-base">
            <path class="nabla-fallback-body" d="M56 62 L136 62 L96 160 Z"></path>
            <ellipse class="nabla-fallback-eye" cx="80" cy="51" rx="15" ry="20"></ellipse>
            <ellipse class="nabla-fallback-eye" cx="112" cy="51" rx="15" ry="20"></ellipse>
            <circle class="nabla-fallback-pupil" cx="80" cy="54" r="7"></circle>
            <circle class="nabla-fallback-pupil" cx="112" cy="54" r="7"></circle>
          </g>
          ${symbols[emote] || ""}
        </svg>
        <nabla-mascot emote="${safeEmote}" color="${safeColor}" duration="2100"></nabla-mascot>
      </span>`;
  }

  function stepComplete(step, topicState) {
    if (step.kind === "pseudocode") return Boolean(topicState.attempts[step.id]?.completedAt);
    return topicState.visitedStepIds.includes(step.id);
  }

  function topicProgress(topic) {
    const topicState = state.topics[topic.id];
    const complete = topic.steps.filter((step) => stepComplete(step, topicState)).length;
    return Math.round((complete / topic.steps.length) * 100);
  }

  function overallProgress() {
    const steps = topics.flatMap((topic) => topic.steps.map((step) => [topic, step]));
    const complete = steps.filter(([topic, step]) => stepComplete(step, state.topics[topic.id])).length;
    return Math.round((complete / steps.length) * 100);
  }

  function showToast(message) {
    document.querySelector(".toast")?.remove();
    clearTimeout(toastTimer);
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.textContent = message;
    document.body.appendChild(toast);
    toastTimer = setTimeout(() => toast.remove(), 2400);
  }

  function render() {
    route = parseRoute();
    if (route.page === "home") renderHome();
    else renderTopic(topicById[route.topicId]);
  }

  function renderHome() {
    transitionPhase = false;
    document.onkeydown = null;
    const overall = overallProgress();
    root.innerHTML = `
      <main class="home-shell">
        <header class="home-header">
          <a class="brand" href="#/" aria-label="University of Twente — Advanced Generative Models Study Studio">
            <img class="ut-logo" src="brand/university-of-twente-white.png" alt="University of Twente">
          </a>
          <div class="home-header-actions">
            <div class="overall-compact">
              <div class="overall-compact-label"><span>Overall</span><span aria-hidden="true">·</span><strong>${overall}%</strong></div>
              <div class="overall-progress" role="progressbar" aria-label="Overall course progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${overall}"><span style="width:${overall}%"></span></div>
            </div>
            ${utilitiesMarkup()}
          </div>
        </header>
        <section class="topics-section" aria-labelledby="topics-title">
          <h1 id="topics-title">Advanced topics</h1>
          <div class="topic-grid">
            ${topics.map((topic) => topicCardMarkup(topic)).join("")}
          </div>
          <p class="home-note">Five self-contained lessons · ${topics.reduce((sum, topic) => sum + topic.steps.length, 0)} slides, animations, demonstrations, and coding labs · notes and progress remain on this device.</p>
        </section>
      </main>
      <input id="import-input" class="sr-only" type="file" accept="application/json,.json">
    `;
    bindHome();
  }

  function topicCardMarkup(topic) {
    const progress = topicProgress(topic);
    return `
      <button class="topic-card" type="button" data-topic="${topic.id}" style="--accent:${topic.accent}" aria-label="${progress ? "Resume" : "Start"} ${escapeHtml(topic.title)}, ${progress}% complete">
        <div class="topic-card-top"><span class="topic-number">${topic.number}</span><span class="topic-duration">${topic.duration}</span></div>
        <div class="topic-card-copy"><p class="topic-kicker">${escapeHtml(topic.kicker)}</p><h3>${escapeHtml(topic.title)}</h3><p>${escapeHtml(topic.subtitle)}</p></div>
        <div class="topic-card-footer">
          <div class="card-progress"><div><span style="width:${progress}%"></span></div><small>${progress}% complete</small></div>
          <span class="topic-status">${progress ? "Resume" : "Start"}<span aria-hidden="true">↗</span></span>
        </div>
      </button>`;
  }

  function utilitiesMarkup() {
    return `
      <div class="utilities">
        <button class="utilities-trigger" type="button" aria-haspopup="menu" aria-expanded="${utilitiesOpen}">Utilities <span aria-hidden="true">⌄</span></button>
        <div class="utilities-menu" role="menu" aria-label="Course utilities" ${utilitiesOpen ? "" : "hidden"}>
          <div class="utilities-save-status" role="status"><span class="status-dot"></span>Saved on this device</div>
          <button type="button" role="menuitem" data-action="export">Export JSON</button>
          <button type="button" role="menuitem" data-action="import">Import JSON</button>
          <a role="menuitem" href="README.txt" download>Offline setup guide</a>
          <button class="danger" type="button" role="menuitem" data-action="reset-course">Reset course</button>
        </div>
      </div>`;
  }

  function bindUtilities(container = document) {
    const trigger = container.querySelector(".utilities-trigger");
    const menu = container.querySelector(".utilities-menu");
    trigger?.addEventListener("click", () => {
      utilitiesOpen = !utilitiesOpen;
      trigger.setAttribute("aria-expanded", String(utilitiesOpen));
      menu.hidden = !utilitiesOpen;
    });
    menu?.querySelector('[data-action="export"]')?.addEventListener("click", exportState);
    menu?.querySelector('[data-action="import"]')?.addEventListener("click", () => document.getElementById("import-input")?.click());
    menu?.querySelector('[data-action="reset-course"]')?.addEventListener("click", resetCourse);
  }

  function bindHome() {
    document.querySelectorAll("[data-topic]").forEach((button) => button.addEventListener("click", () => {
      const topic = topicById[button.dataset.topic];
      const topicState = state.topics[topic.id];
      const step = topic.steps.find((candidate) => candidate.id === topicState.currentStepId) || topic.steps[0];
      transitionPhase = topicState.visitedStepIds.length === 0 && Boolean(step.transitionMedia);
      quizOpen = true;
      location.hash = `#/topic/${topic.id}`;
    }));
    document.getElementById("import-input")?.addEventListener("change", importState);
    bindUtilities();
  }

  function renderTopic(topic) {
    const topicState = state.topics[topic.id];
    const summary = topicState.currentStepId === SUMMARY_ID;
    let index = topic.steps.findIndex((step) => step.id === topicState.currentStepId);
    if (index < 0) index = 0;
    const step = topic.steps[index];

    if (!summary && !transitionPhase && step.kind !== "pseudocode" && !topicState.visitedStepIds.includes(step.id)) {
      topicState.visitedStepIds.push(step.id);
      saveState();
    }

    root.innerHTML = `
      <main class="lesson-page" style="--accent:${topic.accent}">
        ${lessonHeaderMarkup(topic)}
        <div class="lesson-layout">
          ${stepRailMarkup(topic, topicState, summary, index)}
          ${summary ? summaryMarkup(topic, topicState) : lessonMainMarkup(topic, topicState, step, index)}
          ${summary ? "" : step.kind === "pseudocode" ? activityFeedbackMarkup(step, topicState) : notesMarkup(step, topicState)}
        </div>
      </main>
      <input id="import-input" class="sr-only" type="file" accept="application/json,.json">
      ${!summary && step.quiz ? quizMarkup(topic, step, topicState) : ""}
    `;
    bindLesson(topic, topicState, step, index, summary);
  }

  function lessonHeaderMarkup(topic) {
    const progress = topicProgress(topic);
    return `
      <header class="lesson-header">
        <button class="back-button" type="button" data-action="home"><span aria-hidden="true">←</span>All topics</button>
        <div class="lesson-title"><span>${topic.number} / ${escapeHtml(topic.shortTitle)}</span><strong>${escapeHtml(topic.title)}</strong></div>
        <div class="lesson-progress-block">
          <div class="lesson-progress-label"><span>Topic progress</span><strong>${progress}%</strong></div>
          <div class="lesson-progress" role="progressbar" aria-label="${escapeHtml(topic.title)} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><span style="width:${progress}%"></span></div>
        </div>
      </header>`;
  }

  function stepRailMarkup(topic, topicState, summary, currentIndex) {
    return `
      <aside class="step-rail" aria-label="${escapeHtml(topic.title)} lesson steps">
        <div class="rail-heading"><span>Lesson path</span><small>${topic.steps.length} steps</small></div>
        <ol>
          ${topic.steps.map((step, index) => `
            <li><button class="${!summary && index === currentIndex ? "active" : ""} ${stepComplete(step, topicState) ? "visited" : ""}" type="button" data-step-index="${index}" ${!summary && index === currentIndex ? 'aria-current="step"' : ""}>
              <span>${String(index + 1).padStart(2, "0")}</span><span><strong>${escapeHtml(step.title)}</strong><small>${step.kind === "pseudocode" ? "Practice" : step.kind === "video" ? "Demonstration" : "Slide"}</small></span>
            </button></li>`).join("")}
          <li><button class="${summary ? "active" : ""}" type="button" data-action="summary" ${summary ? 'aria-current="step"' : ""}><span>Σ</span><span><strong>Topic summary</strong><small>Synthesis notes</small></span></button></li>
        </ol>
      </aside>`;
  }

  function lessonMainMarkup(topic, topicState, step, index) {
    const isPractice = step.kind === "pseudocode";
    return `
      <section class="lesson-main ${isPractice ? "activity-mode" : ""}" aria-live="polite">
        <div class="step-mobile-label">Step ${index + 1} of ${topic.steps.length}</div>
        <div class="step-actions">
          <button class="button" type="button" data-action="previous" ${index === 0 ? "disabled" : ""}>← Previous ${isPractice ? "item" : "slide"}</button>
          <button class="button primary" type="button" data-action="next">${transitionPhase ? "Skip animation" : index === topic.steps.length - 1 ? "Topic summary" : `Next ${isPractice ? "item" : "slide"}`} →</button>
        </div>
        ${isPractice ? activityMarkup(step, topicState) : mediaAndExplanationMarkup(step)}
      </section>`;
  }

  function mediaAndExplanationMarkup(step) {
    const transition = transitionPhase && step.transitionMedia;
    const source = transition ? step.transitionMedia : step.media;
    const label = transition ? "Transition" : step.kind === "video" ? "Demonstration" : "Keynote frame";
    const alt = transition ? step.transitionAlt || step.alt : step.alt;
    const media = transition || step.kind === "video"
      ? `<video src="${source}" controls ${transition ? "autoplay" : ""} playsinline preload="${step.kind === "video" ? "metadata" : "auto"}" aria-label="${escapeHtml(alt)}"></video>`
      : `<img src="${source}" alt="${escapeHtml(alt)}">`;
    return `
      <figure class="media-stage ${transition ? "transition" : step.kind}">
        <div class="media-topline"><span>${label}</span><span>${transition ? "Into" : "Source"} ${String(step.sourceNumber).padStart(2, "0")}</span></div>
        <div class="media-frame">${media}</div>
        <figcaption>${escapeHtml(alt)}</figcaption>
      </figure>
      <div class="step-explanation">
        <div class="step-heading"><p class="overline">${escapeHtml(step.eyebrow)}</p><h1>${escapeHtml(step.title)}</h1></div>
        <div class="learning-notes">
          <section><h2>Overview</h2><p>${escapeHtml(step.overview)}</p></section>
          <section><h2>Pointers</h2><ul>${step.pointers.map((pointer) => `<li>${escapeHtml(pointer)}</li>`).join("")}</ul></section>
        </div>
      </div>`;
  }

  function notesMarkup(step, topicState) {
    const note = topicState.notes[step.id] || "";
    return `
      <aside class="notes-panel">
        <div class="notes-heading"><div><span>Step notes</span><small>Saved locally</small></div><span class="notes-count">${note.length}</span></div>
        <textarea data-note-for="${step.id}" placeholder="Capture an intuition, rewrite the equation in words, or note what still feels unclear…" aria-label="Notes for ${escapeHtml(step.title)}">${escapeHtml(note)}</textarea>
        <div class="notes-prompts"><span>Try asking yourself</span><button type="button" data-prompt="The key idea is: ">Explain this</button><button type="button" data-prompt="I still need to understand: ">Open question</button></div>
        <div class="notes-footer"><button type="button" data-action="export">Export notebook</button><button type="button" data-action="reset-topic">Reset topic</button></div>
      </aside>`;
  }

  function getAttempt(step, topicState) {
    return topicState.attempts[step.id] || {
      draft: step.activity.starterCode,
      lastCheckedDraft: null,
      completedAt: null,
      revealedHints: [],
      solutionVisible: false,
    };
  }

  function activityMarkup(step, topicState) {
    const attempt = getAttempt(step, topicState);
    const lines = Math.max(1, attempt.draft.split("\n").length);
    return `
      <div class="activity-workspace">
        <header class="activity-intro"><p class="overline">${escapeHtml(step.eyebrow)}</p><h1>${escapeHtml(step.title)}</h1><p>${escapeHtml(step.overview)}</p><ul>${step.pointers.map((pointer) => `<li>${escapeHtml(pointer)}</li>`).join("")}</ul></header>
        <section class="activity-task" aria-labelledby="${step.id}-task">
          <div class="activity-task-heading"><div><span>Write pseudocode</span><small id="${step.id}-task">${escapeHtml(step.activity.prompt)}</small></div><span class="activity-save-state">Saved locally</span></div>
          <div class="code-editor"><pre aria-hidden="true">${Array.from({ length: lines }, (_, i) => i + 1).join("\n")}</pre><textarea spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Pseudocode editor for ${escapeHtml(step.title)}">${escapeHtml(attempt.draft)}</textarea></div>
          <p class="activity-error" role="alert" hidden></p>
          <div class="activity-toolbar">
            <button class="button primary" type="button" data-action="check-code">Check loop</button>
            <button class="button" type="button" data-action="hint" ${attempt.lastCheckedDraft ? "" : "disabled"}>Get hint</button>
            <button class="button" type="button" data-action="reset-code">Reset to starter</button>
            <button class="button ${attempt.solutionVisible ? "is-active" : ""}" type="button" data-action="solution" ${attempt.lastCheckedDraft ? "" : "disabled"}>${attempt.solutionVisible ? "Hide example" : "Compare with example"}</button>
          </div>
          ${attempt.solutionVisible && attempt.lastCheckedDraft ? `<section class="model-solution"><div><span>One possible solution</span><small>Compare structure and concepts—not variable names.</small></div><pre><code>${escapeHtml(step.activity.modelSolution)}</code></pre></section>` : ""}
        </section>
      </div>`;
  }

  function evaluateActivity(step, draft) {
    const lower = draft.toLowerCase();
    return step.activity.rubric.map(([id, label, description, signals]) => ({ id, label, description, present: signals.some((signal) => lower.includes(signal.toLowerCase())) }));
  }

  function activityFeedbackMarkup(step, topicState) {
    const attempt = getAttempt(step, topicState);
    const checked = typeof attempt.lastCheckedDraft === "string";
    const results = checked ? evaluateActivity(step, attempt.lastCheckedDraft) : [];
    const present = results.filter((result) => result.present).length;
    const stale = checked && attempt.draft !== attempt.lastCheckedDraft;
    return `
      <aside class="notes-panel activity-feedback">
        <div class="notes-heading"><div><span>Rubric feedback</span><small>Saved locally</small></div><span class="notes-count">${checked ? `${present}/${step.activity.rubric.length}` : "—"}</span></div>
        <div class="feedback-status ${stale ? "stale" : checked ? "checked" : ""}" role="status">${stale ? "Draft changed—check again." : checked ? `${present} of ${step.activity.rubric.length} concepts detected.` : "Write a draft, then check it for the core concepts."}</div>
        <ul class="rubric-list">
          ${step.activity.rubric.map(([id, label, description]) => {
            const result = results.find((candidate) => candidate.id === id);
            const status = checked ? result?.present ? "present" : "missing" : "neutral";
            return `<li class="${status}"><span aria-hidden="true">${checked ? result?.present ? "✓" : "·" : "○"}</span><div><strong>${escapeHtml(label)}</strong><p>${escapeHtml(description)}</p>${checked ? `<small>${result?.present ? "Present" : "Missing"}</small>` : ""}</div></li>`;
          }).join("")}
        </ul>
        ${attempt.revealedHints.length ? `<section class="revealed-hints"><span>Hints</span>${attempt.revealedHints.map((id) => {
          const criterion = step.activity.rubric.find((item) => item[0] === id);
          return criterion ? `<p>${escapeHtml(criterion[2])}</p>` : "";
        }).join("")}</section>` : ""}
        ${attempt.completedAt ? '<p class="completion-note">Practice complete. Rubric gaps are formative; revise and check again whenever you like.</p>' : ""}
        <div class="notes-footer"><button type="button" data-action="export">Export notebook</button><button type="button" data-action="reset-topic">Reset topic</button></div>
      </aside>`;
  }

  function summaryMarkup(topic, topicState) {
    const progress = topicProgress(topic);
    const completed = topic.steps.filter((step) => stepComplete(step, topicState)).length;
    return `
      <section class="summary-panel">
        <div class="summary-intro"><p class="overline">${topic.number} · Synthesis</p><h1>Make the topic yours.</h1><p>Compress the lesson into the explanation you would give a classmate. Your summary is saved with the rest of your notebook.</p></div>
        <div class="summary-grid">
          <div class="summary-editor"><div class="notes-heading"><div><span>${escapeHtml(topic.title)} summary</span><small>Saved locally</small></div><span class="notes-count">${topicState.summary.length}</span></div><textarea aria-label="${escapeHtml(topic.title)} summary notes" placeholder="Start with: The central idea of this topic is…">${escapeHtml(topicState.summary)}</textarea></div>
          <aside class="summary-status"><div class="summary-progress-number"><strong>${progress}%</strong><span>topic complete</span></div><dl><div><dt>Items complete</dt><dd>${completed}/${topic.steps.length}</dd></div><div><dt>Notes written</dt><dd>${Object.values(topicState.notes).filter((note) => note.trim()).length}</dd></div></dl>${progress < 100 ? "<p>Return to an unviewed lesson or check the coding draft to reach 100%.</p>" : "<p>Every lesson item is complete. Keep the summary as your portable explanation.</p>"}</aside>
        </div>
        <div class="objective-recap"><p class="overline">Can you now…</p><ul>${topic.objectives.map((objective) => `<li>${escapeHtml(objective)}</li>`).join("")}</ul><div class="summary-sources"><p class="overline">Primary sources</p><ul>${topic.sources.map(([label, href]) => `<li><a href="${href}" target="_blank" rel="noreferrer">${escapeHtml(label)} ↗</a></li>`).join("")}</ul></div></div>
        <div class="summary-actions"><button class="button" type="button" data-action="last-step">← Last lesson step</button><button class="button" type="button" data-action="export">Export JSON</button><button class="button primary" type="button" data-action="home">Return to all topics</button></div>
      </section>`;
  }

  function quizMarkup(topic, step, topicState) {
    const answer = topicState.quizzes[step.id]?.answer;
    const selected = step.quiz.options.find((option) => option.id === answer);
    const emote = selected ? selected.correct ? "checkmark" : "incorrect" : "question";
    const optionsById = Object.fromEntries(step.quiz.options.map((option) => [option.id, option]));
    const orderedOptions = topicState.quizOrders[step.id]
      .map((optionId) => optionsById[optionId])
      .filter(Boolean);
    return `
      <div class="nabla-guide ${quizOpen ? "" : "collapsed"}" style="--accent:${topic.accent};--nabla-accent:${topic.accent}">
        <section class="nabla-card" aria-label="Nabla knowledge check" ${quizOpen ? "" : "hidden"}>
          <button class="nabla-close" type="button" aria-label="Close knowledge check">×</button>
          <p class="nabla-eyebrow">Quick check</p><h2>${escapeHtml(step.quiz.title)}</h2><p class="nabla-body">${escapeHtml(step.quiz.body)}</p>
          <div class="nabla-options">
            ${orderedOptions.map((option) => `<button type="button" data-quiz-option="${option.id}" class="${answer === option.id ? option.correct ? "correct" : "incorrect" : ""}" ${answer ? "disabled" : ""}><span aria-hidden="true"></span>${escapeHtml(option.label)}</button>`).join("")}
          </div>
          ${selected ? `<div class="nabla-feedback"><p class="${selected.correct ? "correct" : "incorrect"}">${escapeHtml(selected.feedback)}</p></div>${selected.correct ? `<p class="quiz-result">${escapeHtml(step.quiz.successMessage)}</p>` : '<button class="nabla-action" type="button" data-action="retry-quiz">Try again</button>'}` : ""}
        </section>
        <button class="nabla-character" type="button" aria-label="${quizOpen ? "Hide" : "Open"} Nabla knowledge check">${nablaMascotMarkup(emote, topic.accent)}</button>
      </div>`;
  }

  function bindLesson(topic, topicState, step, index, summary) {
    document.onkeydown = null;
    document.querySelectorAll('[data-action="home"]').forEach((button) => button.addEventListener("click", () => { location.hash = "#/"; }));
    document.querySelectorAll("[data-step-index]").forEach((button) => button.addEventListener("click", () => goToStep(topic, Number(button.dataset.stepIndex), false)));
    document.querySelector('[data-action="summary"]')?.addEventListener("click", () => { topicState.currentStepId = SUMMARY_ID; transitionPhase = false; saveState(); render(); window.scrollTo(0, 0); });
    document.getElementById("import-input")?.addEventListener("change", importState);
    document.querySelectorAll('[data-action="export"]').forEach((button) => button.addEventListener("click", exportState));

    if (summary) {
      document.querySelector(".summary-editor textarea")?.addEventListener("input", (event) => { topicState.summary = event.target.value; saveState(); document.querySelector(".summary-editor .notes-count").textContent = event.target.value.length; });
      document.querySelector('[data-action="last-step"]')?.addEventListener("click", () => goToStep(topic, topic.steps.length - 1, false));
      return;
    }

    document.querySelector('[data-action="previous"]')?.addEventListener("click", () => goToStep(topic, Math.max(0, index - 1), false));
    document.querySelector('[data-action="next"]')?.addEventListener("click", () => {
      if (transitionPhase) { transitionPhase = false; render(); return; }
      if (index === topic.steps.length - 1) { topicState.currentStepId = SUMMARY_ID; saveState(); render(); window.scrollTo(0, 0); return; }
      goToStep(topic, index + 1, true);
    });
    const transitionVideo = transitionPhase ? document.querySelector(".media-stage.transition video") : null;
    transitionVideo?.addEventListener("ended", () => { transitionPhase = false; render(); });
    transitionVideo?.play().catch(() => {});
    document.querySelector(".media-frame img")?.addEventListener("error", mediaError);
    document.querySelector(".media-frame video")?.addEventListener("error", mediaError);

    document.querySelector('[data-action="reset-topic"]')?.addEventListener("click", () => resetTopic(topic));
    if (step.kind === "pseudocode") bindActivity(topic, topicState, step);
    else bindNotes(topicState, step);
    if (step.quiz) bindQuiz(topic, topicState, step);

    document.onkeydown = keyboardNavigation;
    function keyboardNavigation(event) {
      const typing = event.target.matches("textarea, input, button, select, [contenteditable]");
      if (!typing && event.key === "ArrowLeft" && index > 0) goToStep(topic, index - 1, false);
      else if (!typing && event.key === "ArrowRight") {
        if (transitionPhase) { transitionPhase = false; render(); }
        else if (index < topic.steps.length - 1) goToStep(topic, index + 1, true);
      }
    }
  }

  function goToStep(topic, index, playTransition) {
    const topicState = state.topics[topic.id];
    const target = topic.steps[index];
    topicState.currentStepId = target.id;
    transitionPhase = Boolean(playTransition && target.transitionMedia);
    quizOpen = true;
    saveState();
    render();
    window.scrollTo(0, 0);
  }

  function bindNotes(topicState, step) {
    const textarea = document.querySelector(`[data-note-for="${step.id}"]`);
    textarea?.addEventListener("input", (event) => {
      topicState.notes[step.id] = event.target.value;
      saveState();
      document.querySelector(".notes-heading .notes-count").textContent = event.target.value.length;
    });
    document.querySelectorAll("[data-prompt]").forEach((button) => button.addEventListener("click", () => {
      const prefix = textarea.value && !textarea.value.endsWith("\n") ? "\n\n" : "";
      textarea.value += `${prefix}${button.dataset.prompt}`;
      textarea.focus();
      topicState.notes[step.id] = textarea.value;
      saveState();
      document.querySelector(".notes-heading .notes-count").textContent = textarea.value.length;
    }));
  }

  function bindActivity(topic, topicState, step) {
    const textarea = document.querySelector(".code-editor textarea");
    const lineNumbers = document.querySelector(".code-editor pre");
    const updateAttempt = (changes) => {
      const current = getAttempt(step, topicState);
      topicState.attempts[step.id] = { ...current, ...changes };
      saveState();
    };
    textarea?.addEventListener("input", (event) => {
      updateAttempt({ draft: event.target.value });
      lineNumbers.textContent = Array.from({ length: Math.max(1, event.target.value.split("\n").length) }, (_, i) => i + 1).join("\n");
    });
    textarea?.addEventListener("scroll", () => { lineNumbers.scrollTop = textarea.scrollTop; });
    textarea?.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      event.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.setRangeText("  ", start, end, "end");
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    });
    document.querySelector('[data-action="check-code"]')?.addEventListener("click", () => {
      const meaningful = textarea.value.split(/\r?\n/).filter((line) => line.trim() && !line.trim().startsWith("#") && line.trim() !== "...").length;
      const error = document.querySelector(".activity-error");
      if (meaningful < 3) { error.hidden = false; error.textContent = `Add at least 3 pseudocode lines before checking. You currently have ${meaningful}.`; return; }
      error.hidden = true;
      updateAttempt({ lastCheckedDraft: textarea.value, completedAt: getAttempt(step, topicState).completedAt || new Date().toISOString() });
      render();
    });
    document.querySelector('[data-action="hint"]')?.addEventListener("click", () => {
      const attempt = getAttempt(step, topicState);
      const missing = evaluateActivity(step, attempt.draft).find((result) => !result.present && !attempt.revealedHints.includes(result.id));
      if (!missing) { showToast("No unrevealed rubric gaps remain."); return; }
      updateAttempt({ revealedHints: [...attempt.revealedHints, missing.id] });
      render();
    });
    document.querySelector('[data-action="reset-code"]')?.addEventListener("click", () => {
      if (!confirm("Reset this activity to the starter? The draft, feedback, hints, and completion mark will be cleared.")) return;
      delete topicState.attempts[step.id];
      saveState("Coding exercise reset");
      render();
    });
    document.querySelector('[data-action="solution"]')?.addEventListener("click", () => {
      const attempt = getAttempt(step, topicState);
      updateAttempt({ solutionVisible: !attempt.solutionVisible });
      render();
    });
  }

  function bindQuiz(topic, topicState, step) {
    const card = document.querySelector(".nabla-card");
    const guide = document.querySelector(".nabla-guide");
    const character = document.querySelector(".nabla-character");
    const mascot = character?.querySelector("nabla-mascot");
    const mascotStack = character?.querySelector(".nabla-mascot-stack");
    const showAnimatedMascot = () => {
      if (!mascot || !mascotStack) return;
      if (mascot.dataset.nablaReady === "true" || mascot.shadowRoot?.querySelector("svg")) {
        mascotStack.classList.replace("loading", "ready");
        mascotStack.dataset.renderer = "animated";
      }
    };
    const replayMascot = () => {
      showAnimatedMascot();
      if (!mascotStack?.classList.contains("ready")) return;
      try {
        mascot.restart?.();
      } catch (error) {
        console.error("Nabla mascot animation could not restart; the safe renderer remains available.", error);
      }
    };
    mascot?.addEventListener("nabla-ready", () => {
      showAnimatedMascot();
      replayMascot();
    }, { once: true });
    customElements.whenDefined("nabla-mascot")
      .then(() => requestAnimationFrame(() => {
        showAnimatedMascot();
        replayMascot();
      }))
      .catch((error) => console.error("Nabla mascot animation could not initialize; the safe renderer remains available.", error));
    const toggle = (open) => { quizOpen = open; card.hidden = !open; guide.classList.toggle("collapsed", !open); character.setAttribute("aria-label", `${open ? "Hide" : "Open"} Nabla knowledge check`); };
    document.querySelector(".nabla-close")?.addEventListener("click", () => toggle(false));
    character?.addEventListener("click", () => {
      toggle(!quizOpen);
      replayMascot();
    });
    document.querySelectorAll("[data-quiz-option]").forEach((button) => button.addEventListener("click", () => {
      topicState.quizzes[step.id] = { answer: button.dataset.quizOption, answeredAt: new Date().toISOString() };
      saveState();
      render();
    }));
    document.querySelector('[data-action="retry-quiz"]')?.addEventListener("click", () => {
      delete topicState.quizzes[step.id];
      saveState();
      render();
    });
  }

  function mediaError(event) {
    const frame = event.target.closest(".media-frame");
    frame.innerHTML = '<p class="media-error">This media file could not be loaded. Keep the slides, media, and index files together, then reopen the studio.</p>';
  }

  function exportState() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `advanced-generative-models-notebook-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    utilitiesOpen = false;
    showToast("Notebook exported");
  }

  function importState(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const incoming = JSON.parse(reader.result);
        if (!confirm("Import this notebook and replace the progress currently saved on this device?")) return;
        state = normalizeState(incoming);
        saveState("Notebook imported");
        render();
      } catch {
        alert("That file is not a valid Advanced Generative Models notebook export.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function resetTopic(topic) {
    if (!confirm(`Reset notes and progress for “${topic.title}”?`)) return;
    state.topics[topic.id] = emptyTopicState(topic);
    transitionPhase = false;
    saveState("Topic reset");
    render();
  }

  function resetCourse() {
    if (!confirm("Reset all notes, quiz answers, coding drafts, summaries, and progress for this course?")) return;
    state = defaultState();
    saveState("Course reset");
    utilitiesOpen = false;
    render();
  }

  window.addEventListener("hashchange", () => {
    utilitiesOpen = false;
    if (parseRoute().page === "topic" && route.page === "home") {
      const topic = topicById[parseRoute().topicId];
      const topicState = state.topics[topic.id];
      const step = topic.steps.find((candidate) => candidate.id === topicState.currentStepId) || topic.steps[0];
      transitionPhase = topicState.visitedStepIds.length === 0 && Boolean(step.transitionMedia);
    }
    quizOpen = true;
    render();
  });

  render();
})();
