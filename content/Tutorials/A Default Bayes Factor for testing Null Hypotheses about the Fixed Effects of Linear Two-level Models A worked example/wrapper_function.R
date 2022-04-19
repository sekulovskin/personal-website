# ======================================================
#Wrapper function for testing the (fixed) parameters of
#two level `lmer` models using `bain`

# x <- fitted 'lmer' model
# hypotheses <- specified hypotheses for bain (see:https://cran.r-project.org/web/packages/bain/vignettes/Introduction_to_bain.html)
# fraction <- size (multiplicative factor) of the minimal value for J
# Standardize <- when set to TRUE, applies overall data standardization
# N sample size to be used. Options: 1) N = "level_1" - uses the level 1 observations;
# 2) N = "level_2" - uses the level 2 observations; 3) N = "ICC_effective" - uses the effective sample size
# based on the 'ICC approach' (see, for example, https://www.healthknowledge.org.uk/public-health-textbook/research-methods/1a-epidemiology/clustered-data)
# 4) N = number - the users can specify the sample size to be used themselves (this is useful when using the 'multiple imputation approach' to the effective sample size)
# seed <- setting the value for the random seed (users are advised to run the analysis with two random seeds, in order to ensure stability of the results)
# jref <- If Jref is set to TRUE then J_ref is used (derived by having the BF = 19, when the effect size
#for the fixed effects is zero in the data). In this case the suppiled value for the argument fraction is ignored.
#======================================================

bain_2lmer <- function(x, hypotheses, fraction, standardize = FALSE, 
                       N, seed, jref = FALSE){
  options(warn = -1)
  n_vas <- names(x@frame) #extract names of all variables in the data
  
  #--------------------------------------
  

 if(jref == FALSE){
   
    if(N == "level_1"){
      
      N <- nrow(x@frame) #sample size = level 1 observations
      
      if(standardize == FALSE){ 
        
        #Unstandardized data
        fixed_estimates <- lme4::fixef(x)[-1]  # obtain fix effects 
        cov <- as.matrix(vcov(x)[-1, -1]) #obtain the covariance matrix of the 
        #--------------------------------------
        
        set.seed(seed)
        results <- bain::bain(fixed_estimates, hypotheses, n = N, Sigma = cov, 
                              group_parameters = 0, 
                              joint_parameters = length(fixed_estimates), 
                              fraction = fraction)
      }
      
      else{
        
        #Overall standardization of the data "overall predictors"`
        standardized <- apply(x@frame[, -ncol(x@frame)], 2, scale)
        standardized <- as.data.frame(standardized)
        standardized[, ncol(standardized) + 1] <- x@frame[, ncol(x@frame)] #group
        names(standardized) <- n_vas #add the same names
        s <- lme4::lmer(x@call$formula, data = standardized, REML = FALSE)
        fixed_estimates_s <- lme4::fixef(s)[-1] # obtain fix effects 
        cov_s <- as.matrix(vcov(s)[-1, -1]) #obtain the covariance matrix of the 
        #--------------------------------------
        
        set.seed(seed)
        results <- bain::bain(fixed_estimates_s, hypotheses, n = N, Sigma = cov_s,
                              group_parameters = 0, joint_parameters = length(fixed_estimates_s), 
                              fraction = fraction)
      }
      
    }
    
    
    if(N == "level_2"){
      
      N <- length(unique(x@frame[,ncol(x@frame)])) #sample size = level 2 observations
      
      if(standardize == FALSE){ 
        
        #Unstandardized data
        fixed_estimates <- lme4::fixef(x)[-1]  # obtain fix effects 
        cov <- as.matrix(vcov(x)[-1, -1]) #obtain the covariance matrix of the 
        #--------------------------------------
        set.seed(seed)
        results <- bain::bain(fixed_estimates, hypotheses, n = N, Sigma = cov, 
                              group_parameters = 0, 
                              joint_parameters = length(fixed_estimates), 
                              fraction = fraction)
      }
      
      else{
        
        #Overall standardization of the data "overall predictors"`
        standardized <- apply(x@frame[, -ncol(x@frame)], 2, scale)
        standardized <- as.data.frame(standardized)
        standardized[, ncol(standardized) + 1] <- x@frame[, ncol(x@frame)] #group factor
        names(standardized) <- n_vas #add the same names
        s <- lme4::lmer(x@call$formula, data = standardized, REML = FALSE)
        fixed_estimates_s <- lme4::fixef(s)[-1] # obtain fix effects 
        cov_s <- as.matrix(vcov(s)[-1, -1]) #obtain the covariance matrix of the 
        #--------------------------------------
        
        set.seed(seed)
        results <- bain::bain(fixed_estimates_s, hypotheses, n = N, Sigma = cov_s,
                              group_parameters = 0, joint_parameters = length(fixed_estimates_s), 
                              fraction = fraction)
      }
      
    }
    
    if(N == "ICC_effective"){
      
      N_lvl1 <- nrow(x@frame)
      gr <- x@frame[ , ncol(x@frame)] # extract grouping factor
      split_gr <- split(x@frame, gr) #split with respect to the grouping variable
      N_clus <- mean(sapply(split_gr, nrow)) # compute the average group size
      model_0 <- lme4::lmer(x@frame[,1] ~ 1 + (1|gr)) # fit a random-intercept model
      var <- as.data.frame(VarCorr(model_0)) #extract the variances of the random intercept and residuals
      ICC <- var[1, 4]/ (var[1, 4] + var[2, 4]) #compute the ICC
      
      #compute the effective sample size based on the ICC approach 
      N <- N_lvl1 / (1 + (N_clus - 1) * ICC)
      
      if(standardize == FALSE){ 
        
        #Unstandardized data
        fixed_estimates <- lme4::fixef(x)[-1]  # obtain fix effects 
        cov <- as.matrix(vcov(x)[-1, -1]) #obtain the covariance matrix of the 
        #--------------------------------------
        
        set.seed(seed)
        results <- bain::bain(fixed_estimates, hypotheses, n = N, Sigma = cov, 
                              group_parameters = 0, 
                              joint_parameters = length(fixed_estimates), 
                              fraction = fraction)
      }
      
      else{
        
        #Overall standardization of the data "overall predictors"`
        standardized <- apply(x@frame[, -ncol(x@frame)], 2, scale)
        standardized <- as.data.frame(standardized)
        standardized[, ncol(standardized) + 1] <- x@frame[, ncol(x@frame)] #group
        names(standardized) <- n_vas #add the same names
        s <- lme4::lmer(x@call$formula, data = standardized, REML = FALSE)
        fixed_estimates_s <- lme4::fixef(s)[-1] # obtain fix effects 
        cov_s <- as.matrix(vcov(s)[-1, -1]) #obtain the covariance matrix of the 
        #--------------------------------------
        
        set.seed(seed)
        results <- bain::bain(fixed_estimates_s, hypotheses, n = N, Sigma = cov_s,
                              group_parameters = 0, joint_parameters = length(fixed_estimates_s), 
                              fraction = fraction)
      }
      
    }
    
    if(N == N){
      
      N <- N #value supplied by the user
      
      if(standardize == FALSE){ 
        
        #Unstandardized data
        fixed_estimates <- lme4::fixef(x)[-1]  # obtain fix effects 
        cov <- as.matrix(vcov(x)[-1, -1]) #obtain the covariance matrix of th
        #--------------------------------------
        
        set.seed(seed)
        results <- bain::bain(fixed_estimates, hypotheses, n = N, Sigma = cov, 
                              group_parameters = 0, 
                              joint_parameters = length(fixed_estimates), 
                              fraction = fraction)
      }
      
      else{
        
        #Overall standardization of the data "overall predictors"`
        standardized <- apply(x@frame[, -ncol(x@frame)], 2, scale)
        standardized <- as.data.frame(standardized)
        standardized[, ncol(standardized) + 1] <- x@frame[, ncol(x@frame)] #group
        names(standardized) <- n_vas #add the same names
        s <- lme4::lmer(x@call$formula, data = standardized, REML = FALSE)
        fixed_estimates_s <- lme4::fixef(s)[-1] # obtain fix effects 
        cov_s <- as.matrix(vcov(s)[-1, -1]) #obtain the covariance matrix of the 
        #--------------------------------------
        
        set.seed(seed)
        results <- bain::bain(fixed_estimates_s, hypotheses, n = N, Sigma = cov_s,
                              group_parameters = 0, joint_parameters = length(fixed_estimates_s), 
                              fraction = fraction)
      }
      
    }
 } 

 else{  #Using fracref
   
   M <- length(lme4::fixef(x)[-1]) #number of predictors
   
   if(N == "level_1"){
     
     N <- nrow(x@frame) #sample size = level 1 observations
     
     #calculate fracref
     fracref <- (N / 19^(2/M))/M
     
     if(standardize == FALSE){ 
       
       #Unstandardized data
       fixed_estimates <- lme4::fixef(x)[-1]  # obtain fix effects 
       cov <- as.matrix(vcov(x)[-1, -1]) #obtain the covariance matrix of the 
       #--------------------------------------
       
       set.seed(seed)
       results <- bain::bain(fixed_estimates, hypotheses, n = N, Sigma = cov, 
                             group_parameters = 0, 
                             joint_parameters = length(fixed_estimates), 
                             fraction = fracref)
     }
     
     else{
       
       #Overall standardization of the data "overall predictors"`
       standardized <- apply(x@frame[, -ncol(x@frame)], 2, scale)
       standardized <- as.data.frame(standardized)
       standardized[, ncol(standardized) + 1] <- x@frame[, ncol(x@frame)] #group
       names(standardized) <- n_vas #add the same names
       s <- lme4::lmer(x@call$formula, data = standardized, REML = FALSE)
       fixed_estimates_s <- lme4::fixef(s)[-1] # obtain fix effects 
       cov_s <- as.matrix(vcov(s)[-1, -1]) #obtain the covariance matrix of the 
       #--------------------------------------
       
       set.seed(seed)
       results <- bain::bain(fixed_estimates_s, hypotheses, n = N, Sigma = cov_s,
                             group_parameters = 0, joint_parameters = length(fixed_estimates_s), 
                             fraction = fracref)
     }
     
   }
   
   
   if(N == "level_2"){
    
     N <- length(unique(x@frame[,ncol(x@frame)])) #sample size = level 2 observations
     
     #calculate fracref
     fracref <- (N / 19^(2/M))/M
     
     if(standardize == FALSE){ 
       
       #Unstandardized data
       fixed_estimates <- lme4::fixef(x)[-1]  # obtain fix effects 
       cov <- as.matrix(vcov(x)[-1, -1]) #obtain the covariance matrix of the 
       #--------------------------------------
       set.seed(seed)
       results <- bain::bain(fixed_estimates, hypotheses, n = N, Sigma = cov, 
                             group_parameters = 0, 
                             joint_parameters = length(fixed_estimates), 
                             fraction = fracref)
     }
     
     else{
       
       #Overall standardization of the data "overall predictors"`
       standardized <- apply(x@frame[, -ncol(x@frame)], 2, scale)
       standardized <- as.data.frame(standardized)
       standardized[, ncol(standardized) + 1] <- x@frame[, ncol(x@frame)] #group factor
       names(standardized) <- n_vas #add the same names
       s <- lme4::lmer(x@call$formula, data = standardized, REML = FALSE)
       fixed_estimates_s <- lme4::fixef(s)[-1] # obtain fix effects 
       cov_s <- as.matrix(vcov(s)[-1, -1]) #obtain the covariance matrix of the 
       #--------------------------------------
       
       set.seed(seed)
       results <- bain::bain(fixed_estimates_s, hypotheses, n = N, Sigma = cov_s,
                             group_parameters = 0, joint_parameters = length(fixed_estimates_s), 
                             fraction = fracref)
     }
     
   }
   
   if(N == "ICC_effective"){
    
     N_lvl1 <- nrow(x@frame)
     gr <- x@frame[ , ncol(x@frame)] # extract grouping factor
     split_gr <- split(x@frame, gr) #split with respect to the grouping variable
     N_clus <- mean(sapply(split_gr, nrow)) # compute the average group size
     model_0 <- lme4::lmer(x@frame[,1] ~ 1 + (1|gr)) # fit a random-intercept model
     var <- as.data.frame(VarCorr(model_0)) #extract the variances of the random intercept and residuals
     ICC <- var[1, 4]/ (var[1, 4] + var[2, 4]) #compute the ICC
     
     #compute the effective sample size based on the ICC approach 
     N <- N_lvl1 / (1 + (N_clus - 1) * ICC)
     
     #calculate fracref
     fracref <- (N / 19^(2/M))/M
     
     if(standardize == FALSE){ 
       
       #Unstandardized data
       fixed_estimates <- lme4::fixef(x)[-1]  # obtain fix effects 
       cov <- as.matrix(vcov(x)[-1, -1]) #obtain the covariance matrix of the 
       #--------------------------------------
       
       set.seed(seed)
       results <- bain::bain(fixed_estimates, hypotheses, n = N, Sigma = cov, 
                             group_parameters = 0, 
                             joint_parameters = length(fixed_estimates), 
                             fraction = fracref)
     }
     
     else{
       
       #Overall standardization of the data "overall predictors"`
       standardized <- apply(x@frame[, -ncol(x@frame)], 2, scale)
       standardized <- as.data.frame(standardized)
       standardized[, ncol(standardized) + 1] <- x@frame[, ncol(x@frame)] #group
       names(standardized) <- n_vas #add the same names
       s <- lme4::lmer(x@call$formula, data = standardized, REML = FALSE)
       fixed_estimates_s <- lme4::fixef(s)[-1] # obtain fix effects 
       cov_s <- as.matrix(vcov(s)[-1, -1]) #obtain the covariance matrix of the 
       #--------------------------------------
       
       set.seed(seed)
       results <- bain::bain(fixed_estimates_s, hypotheses, n = N, Sigma = cov_s,
                             group_parameters = 0, joint_parameters = length(fixed_estimates_s), 
                             fraction = fracref)
     }
     
   }
   
   if(N == N){
     
     N <- N #value supplied by the user
     
     #calculate fracref
     fracref <- (N / 19^(2/M))/M
     
     if(standardize == FALSE){ 
       
       #Unstandardized data
       fixed_estimates <- lme4::fixef(x)[-1]  # obtain fix effects 
       cov <- as.matrix(vcov(x)[-1, -1]) #obtain the covariance matrix of th
       #--------------------------------------
       
       set.seed(seed)
       results <- bain::bain(fixed_estimates, hypotheses, n = N, Sigma = cov, 
                             group_parameters = 0, 
                             joint_parameters = length(fixed_estimates), 
                             fraction = fracref)
     }
     
     else{
       
       #Overall standardization of the data "overall predictors"`
       standardized <- apply(x@frame[, -ncol(x@frame)], 2, scale)
       standardized <- as.data.frame(standardized)
       standardized[, ncol(standardized) + 1] <- x@frame[, ncol(x@frame)] #group
       names(standardized) <- n_vas #add the same names
       s <- lme4::lmer(x@call$formula, data = standardized, REML = FALSE)
       fixed_estimates_s <- lme4::fixef(s)[-1] # obtain fix effects 
       cov_s <- as.matrix(vcov(s)[-1, -1]) #obtain the covariance matrix of the 
       #--------------------------------------
       
       set.seed(seed)
       results <- bain::bain(fixed_estimates_s, hypotheses, n = N, Sigma = cov_s,
                             group_parameters = 0, joint_parameters = length(fixed_estimates_s), 
                             fraction = fracref)
     }
     
   }
   
   
   
   
 }

    return(results)
}   
